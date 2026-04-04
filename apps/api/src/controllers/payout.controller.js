const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const payoutService = require('../services/payout.service');

const processPayout = asyncHandler(async (req, res) => {
  const result = await payoutService.processPayoutForClaim(req.params.claimId);
  return sendSuccess(res, result, 'Payout processed successfully', 201);
});

const getMyPayouts = asyncHandler(async (req, res) => {
  const result = await payoutService.getMyPayouts(req.user.id);
  return sendSuccess(res, result, 'Payouts fetched successfully', 200);
});

module.exports = {
  processPayout,
  getMyPayouts
};