const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const getHealth = asyncHandler(async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  return sendSuccess(
    res,
    {
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },
    'Elite Suraksha API and database are running'
  );
});

module.exports = {
  getHealth
};