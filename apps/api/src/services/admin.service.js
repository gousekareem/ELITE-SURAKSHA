const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

const getDashboardMetrics = async () => {
  const [
    totalUsers,
    totalWorkers,
    totalPolicies,
    activePolicies,
    totalClaims,
    pendingClaims,
    manualReviewClaims,
    rejectedClaims,
    paidClaims,
    totalPayouts,
    successfulPayouts,
    riskSnapshots
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workerProfile.count(),
    prisma.policy.count(),
    prisma.policy.count({ where: { status: 'ACTIVE' } }),
    prisma.claim.count(),
    prisma.claim.count({ where: { status: 'PENDING' } }),
    prisma.claim.count({ where: { status: 'MANUAL_REVIEW' } }),
    prisma.claim.count({ where: { status: 'REJECTED' } }),
    prisma.claim.count({ where: { status: 'PAID' } }),
    prisma.payout.count(),
    prisma.payout.count({ where: { status: 'SUCCESS' } }),
    prisma.riskSnapshot.count()
  ]);

  const payoutAggregate = await prisma.payout.aggregate({
    _sum: {
      amount: true
    }
  });

  const claimAggregate = await prisma.claim.aggregate({
    _sum: {
      payoutAmount: true
    }
  });

  return {
    totalUsers,
    totalWorkers,
    totalPolicies,
    activePolicies,
    totalClaims,
    pendingClaims,
    manualReviewClaims,
    rejectedClaims,
    paidClaims,
    totalPayouts,
    successfulPayouts,
    riskSnapshots,
    totalPayoutAmount: payoutAggregate._sum.amount || 0,
    totalClaimExposure: claimAggregate._sum.payoutAmount || 0
  };
};

const getWorkers = async () => {
  return prisma.workerProfile.findMany({
    include: {
      user: true,
      documents: true,
      policies: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getPolicies = async () => {
  return prisma.policy.findMany({
    include: {
      workerProfile: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getClaims = async () => {
  return prisma.claim.findMany({
    include: {
      workerProfile: {
        include: {
          user: true
        }
      },
      policy: true,
      triggerEvent: true,
      payouts: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getPayouts = async () => {
  return prisma.payout.findMany({
    include: {
      workerProfile: {
        include: {
          user: true
        }
      },
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
};

const reviewClaim = async (claimId, payload) => {
  const { action, reviewNote } = payload;

  const claim = await prisma.claim.findUnique({
    where: { id: claimId }
  });

  if (!claim) {
    throw new AppError('Claim not found', 404);
  }

  if (!['approve', 'reject'].includes(action)) {
    throw new AppError('action must be approve or reject', 400);
  }

  const status = action === 'approve' ? 'AUTO_APPROVED' : 'REJECTED';
  const reasonPrefix = action === 'approve' ? 'Admin approved' : 'Admin rejected';

  return prisma.claim.update({
    where: { id: claimId },
    data: {
      status,
      reason: reviewNote ? `${reasonPrefix}: ${reviewNote}` : reasonPrefix
    },
    include: {
      workerProfile: true,
      policy: true,
      triggerEvent: true,
      payouts: true
    }
  });
};

const updateWorkerVerification = async (workerProfileId, payload) => {
  const { kycStatus, employmentStatus } = payload;

  const worker = await prisma.workerProfile.findUnique({
    where: { id: workerProfileId }
  });

  if (!worker) {
    throw new AppError('Worker profile not found', 404);
  }

  const allowedVerificationStatuses = ['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED'];

  if (kycStatus && !allowedVerificationStatuses.includes(kycStatus)) {
    throw new AppError('Invalid kycStatus', 400);
  }

  if (employmentStatus && !allowedVerificationStatuses.includes(employmentStatus)) {
    throw new AppError('Invalid employmentStatus', 400);
  }

  if (!kycStatus && !employmentStatus) {
    throw new AppError('At least one verification field must be provided', 400);
  }

  return prisma.workerProfile.update({
    where: { id: workerProfileId },
    data: {
      ...(kycStatus ? { kycStatus } : {}),
      ...(employmentStatus ? { employmentStatus } : {})
    },
    include: {
      user: true,
      documents: true,
      policies: true
    }
  });
};

module.exports = {
  getDashboardMetrics,
  getWorkers,
  getPolicies,
  getClaims,
  getPayouts,
  reviewClaim,
  updateWorkerVerification
};