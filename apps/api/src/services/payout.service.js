const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

const processPayoutForClaim = async (claimId) => {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      workerProfile: true,
      payouts: true
    }
  });

  if (!claim) {
    throw new AppError('Claim not found', 404);
  }

  if (claim.status !== 'AUTO_APPROVED') {
    throw new AppError('Only AUTO_APPROVED claims can be processed for payout', 400);
  }

  const existingSuccessfulPayout = await prisma.payout.findFirst({
    where: {
      claimId,
      status: 'SUCCESS'
    }
  });

  if (existingSuccessfulPayout) {
    throw new AppError('Payout already processed for this claim', 400);
  }

  const providerRef = `PAYOUT_${Date.now()}_${claim.id.slice(-6)}`;

  const payout = await prisma.payout.create({
    data: {
      workerProfileId: claim.workerProfileId,
      claimId: claim.id,
      amount: claim.payoutAmount,
      method: 'UPI',
      provider: 'LOCAL_TEST_ENGINE',
      providerRef,
      status: 'SUCCESS',
      attemptedAt: new Date(),
      settledAt: new Date()
    }
  });

  await prisma.claim.update({
    where: { id: claim.id },
    data: {
      status: 'PAID'
    }
  });

  return payout;
};

const getMyPayouts = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true }
  });

  if (!user) {
    throw new AppError('Authenticated user not found', 404);
  }

  if (!user.workerProfile) {
    throw new AppError('Worker profile not found', 404);
  }

  const payouts = await prisma.payout.findMany({
    where: {
      workerProfileId: user.workerProfile.id
    },
    include: {
      claim: {
        include: {
          triggerEvent: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return payouts;
};

module.exports = {
  processPayoutForClaim,
  getMyPayouts
};