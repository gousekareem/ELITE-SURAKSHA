const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const policyService = require('../services/policy.service');

const getQuote = asyncHandler(async (req, res) => {
  const result = await policyService.getQuote(req.user.id);
  return sendSuccess(res, result, 'Policy quote generated successfully', 200);
});

const activatePolicy = asyncHandler(async (req, res) => {
  const result = await policyService.activatePolicy(req.user.id, req.body || {});
  return sendSuccess(res, result, 'Policy activated successfully', 201);
});

const getMyPolicy = asyncHandler(async (req, res) => {
  const result = await policyService.getMyPolicy(req.user.id);
  return sendSuccess(
    res,
    result,
    result ? 'Policy fetched successfully' : 'No policy found for this worker',
    200
  );
});

module.exports = {
  getQuote,
  activatePolicy,
  getMyPolicy
};