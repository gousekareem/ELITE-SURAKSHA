const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const riskService = require('../services/risk.service');

const recalculateRisk = asyncHandler(async (req, res) => {
  const result = await riskService.recalculateRisk(req.user.id);

  return sendSuccess(res, result, 'Risk snapshot generated successfully', 201);
});

const getLatestRiskSnapshot = asyncHandler(async (req, res) => {
  const result = await riskService.getLatestRiskSnapshot(req.user.id);

  return sendSuccess(
    res,
    result,
    result ? 'Latest risk snapshot fetched successfully' : 'No risk snapshot found',
    200
  );
});

module.exports = {
  recalculateRisk,
  getLatestRiskSnapshot
};