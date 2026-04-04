const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const claimService = require('../services/claim.service');

const getMyClaims = asyncHandler(async (req, res) => {
  const result = await claimService.getMyClaims(req.user.id);
  return sendSuccess(res, result, 'Claims fetched successfully', 200);
});

const evaluateClaimFraud = asyncHandler(async (req, res) => {
  const result = await claimService.evaluateClaimFraud(req.params.claimId);
  return sendSuccess(res, result, 'Claim evaluated successfully', 200);
});

module.exports = {
  getMyClaims,
  evaluateClaimFraud
};