const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { TRIGGER_PAYOUTS } = require('../constants/claim.constants');

const allowedTriggerTypes = [
  'HEAVY_RAIN',
  'HAZARDOUS_AQI',
  'EXTREME_HEAT',
  'FLOOD_ALERT',
  'CURFEW'
];

const createTriggerEventAndClaims = async (payload) => {
  const {
    triggerType,
    city,
    zoneCode,
    thresholdValue,
    actualValue,
    detectedAt,
    source
  } = payload;

  if (!allowedTriggerTypes.includes(triggerType)) {
    throw new AppError('Invalid triggerType', 400);
  }

  const eventDetectedAt = detectedAt ? new Date(detectedAt) : new Date();

  if (Number.isNaN(eventDetectedAt.getTime())) {
    throw new AppError('detectedAt must be a valid date', 400);
  }

  const triggerEvent = await prisma.triggerEvent.create({
    data: {
      triggerType,
      city: city.trim(),
      zoneCode: zoneCode ? zoneCode.trim() : null,
      thresholdValue: String(thresholdValue),
      actualValue: String(actualValue),
      detectedAt: eventDetectedAt,
      source: source ? source.trim() : 'SYSTEM'
    }
  });

  const cityNormalized = city.trim().toLowerCase();

  const eligiblePolicies = await prisma.policy.findMany({
    where: {
      status: 'ACTIVE',
      coverageStart: {
        lte: eventDetectedAt
      },
      coverageEnd: {
        gte: eventDetectedAt
      },
      workerProfile: {
        primaryCity: {
          equals: cityNormalized,
          mode: 'insensitive'
        }
      }
    },
    include: {
      workerProfile: true
    }
  });

  const createdClaims = [];

  for (const policy of eligiblePolicies) {
    const existingClaim = await prisma.claim.findFirst({
      where: {
        workerProfileId: policy.workerProfileId,
        triggerEventId: triggerEvent.id
      }
    });

    if (existingClaim) {
      continue;
    }

    const payoutAmount = TRIGGER_PAYOUTS[triggerType] || 200;

    const claim = await prisma.claim.create({
      data: {
        workerProfileId: policy.workerProfileId,
        policyId: policy.id,
        triggerEventId: triggerEvent.id,
        status: 'PENDING',
        payoutAmount,
        fraudScore: 0,
        reason: `${triggerType} trigger matched for ${policy.workerProfile.primaryCity}`
      }
    });

    createdClaims.push(claim);
  }

  return {
    triggerEvent,
    claimsCreatedCount: createdClaims.length,
    claims: createdClaims
  };
};

const getTriggerEvents = async () => {
  const events = await prisma.triggerEvent.findMany({
    include: {
      claims: true
    },
    orderBy: {
      detectedAt: 'desc'
    }
  });

  return events;
};

module.exports = {
  createTriggerEventAndClaims,
  getTriggerEvents
};