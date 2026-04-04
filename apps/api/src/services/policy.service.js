const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { DEFAULT_POLICY_EXCLUSIONS } = require('../constants/policy.constants');
const { calculateRiskComponents } = require('./risk.service');

const ensureWorkerWithProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true }
  });

  if (!user) {
    throw new AppError('Authenticated user not found', 404);
  }

  if (user.role !== 'WORKER') {
    throw new AppError('Only worker accounts can perform this action', 403);
  }

  if (!user.workerProfile) {
    throw new AppError('Worker profile not found. Complete onboarding first.', 400);
  }

  return user;
};

const resolvePremiumForWorker = async (workerProfileId, workerProfile) => {
  const latestSnapshot = await prisma.riskSnapshot.findFirst({
    where: {
      workerProfileId
    },
    orderBy: {
      generatedAt: 'desc'
    }
  });

  if (latestSnapshot) {
    return {
      recommendedPremium: Number(latestSnapshot.recommendedPremium),
      latestSnapshot
    };
  }

  const calculated = calculateRiskComponents(workerProfile);

  return {
    recommendedPremium: calculated.recommendedPremium,
    latestSnapshot: null
  };
};

const getQuote = async (userId) => {
  const user = await ensureWorkerWithProfile(userId);
  const workerProfile = user.workerProfile;

  const premiumData = await resolvePremiumForWorker(workerProfile.id, workerProfile);

  return {
    workerProfileId: workerProfile.id,
    planName: 'Elite Suraksha Weekly Income Shield',
    weeklyPremium: premiumData.recommendedPremium,
    currency: 'INR',
    exclusions: DEFAULT_POLICY_EXCLUSIONS,
    eligibility: {
      kycStatus: workerProfile.kycStatus,
      employmentStatus: workerProfile.employmentStatus,
      profileComplete: true
    },
    riskSnapshotUsed: premiumData.latestSnapshot
      ? {
          id: premiumData.latestSnapshot.id,
          totalRiskScore: premiumData.latestSnapshot.totalRiskScore,
          generatedAt: premiumData.latestSnapshot.generatedAt
        }
      : null
  };
};

const activatePolicy = async (userId, payload) => {
  const user = await ensureWorkerWithProfile(userId);
  const workerProfile = user.workerProfile;

  if (!['PENDING', 'VERIFIED'].includes(workerProfile.kycStatus)) {
    throw new AppError('KYC must be started before policy activation', 400);
  }

  if (!['PENDING', 'VERIFIED'].includes(workerProfile.employmentStatus)) {
    throw new AppError('Employment verification must be started before policy activation', 400);
  }

  const existingActivePolicy = await prisma.policy.findFirst({
    where: {
      workerProfileId: workerProfile.id,
      status: 'ACTIVE',
      coverageEnd: {
        gte: new Date()
      }
    }
  });

  if (existingActivePolicy) {
    throw new AppError('An active policy already exists for this worker', 400);
  }

  const premiumData = await resolvePremiumForWorker(workerProfile.id, workerProfile);

  const startDate = payload.coverageStart ? new Date(payload.coverageStart) : new Date();

  if (Number.isNaN(startDate.getTime())) {
    throw new AppError('coverageStart must be a valid date', 400);
  }

  const coverageEnd = new Date(startDate);
  coverageEnd.setDate(coverageEnd.getDate() + 7);

  const policy = await prisma.policy.create({
    data: {
      workerProfileId: workerProfile.id,
      planName: 'Elite Suraksha Weekly Income Shield',
      weeklyPremium: premiumData.recommendedPremium,
      coverageStart: startDate,
      coverageEnd,
      status: 'ACTIVE',
      exclusionsText: DEFAULT_POLICY_EXCLUSIONS.join('\n')
    }
  });

  return {
    ...policy,
    exclusions: DEFAULT_POLICY_EXCLUSIONS
  };
};

const getMyPolicy = async (userId) => {
  const user = await ensureWorkerWithProfile(userId);

  const policy = await prisma.policy.findFirst({
    where: {
      workerProfileId: user.workerProfile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!policy) {
    return null;
  }

  return {
    ...policy,
    exclusions: policy.exclusionsText ? policy.exclusionsText.split('\n') : []
  };
};

module.exports = {
  getQuote,
  activatePolicy,
  getMyPolicy
};