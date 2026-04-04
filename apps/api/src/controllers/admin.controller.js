const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const adminService = require('../services/admin.service');

const getDashboard = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardMetrics();
  return sendSuccess(res, result, 'Admin dashboard fetched successfully', 200);
});

const getWorkers = asyncHandler(async (req, res) => {
  const result = await adminService.getWorkers();
  return sendSuccess(res, result, 'Admin workers fetched successfully', 200);
});

const getPolicies = asyncHandler(async (req, res) => {
  const result = await adminService.getPolicies();
  return sendSuccess(res, result, 'Admin policies fetched successfully', 200);
});

const getClaims = asyncHandler(async (req, res) => {
  const result = await adminService.getClaims();
  return sendSuccess(res, result, 'Admin claims fetched successfully', 200);
});

const getPayouts = asyncHandler(async (req, res) => {
  const result = await adminService.getPayouts();
  return sendSuccess(res, result, 'Admin payouts fetched successfully', 200);
});

const reviewClaim = asyncHandler(async (req, res) => {
  const result = await adminService.reviewClaim(req.params.claimId, req.body || {});
  return sendSuccess(res, result, 'Admin claim review completed successfully', 200);
});

const updateWorkerVerification = asyncHandler(async (req, res) => {
  const result = await adminService.updateWorkerVerification(
    req.params.workerProfileId,
    req.body || {}
  );
  return sendSuccess(res, result, 'Worker verification updated successfully', 200);
});

module.exports = {
  getDashboard,
  getWorkers,
  getPolicies,
  getClaims,
  getPayouts,
  reviewClaim,
  updateWorkerVerification
};