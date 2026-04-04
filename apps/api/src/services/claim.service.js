const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

const getMyClaims = async (userId) => {
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

  const claims = await prisma.claim.findMany({
    where: {
      workerProfileId: user.workerProfile.id
    },
    include: {
      policy: true,
      triggerEvent: true,
      payouts: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return claims;
};

module.exports = {
  getMyClaims
};