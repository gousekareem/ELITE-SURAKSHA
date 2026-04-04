const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const workerService = require('../services/worker.service');

const upsertMyProfile = asyncHandler(async (req, res) => {
  const result = await workerService.upsertWorkerProfile(req.user.id, req.body);

  return sendSuccess(res, result, 'Worker profile saved successfully', 200);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const result = await workerService.getCurrentWorkerProfile(req.user.id);

  return sendSuccess(
    res,
    result,
    result ? 'Worker profile fetched successfully' : 'Worker profile not created yet',
    200
  );
});

const uploadDocument = asyncHandler(async (req, res) => {
  const result = await workerService.uploadWorkerDocument(
    req.user.id,
    req.file,
    req.body.type
  );

  return sendSuccess(res, result, 'Worker document uploaded successfully', 201);
});

const getMyDocuments = asyncHandler(async (req, res) => {
  const result = await workerService.getWorkerDocuments(req.user.id);

  return sendSuccess(res, result, 'Worker documents fetched successfully', 200);
});

const startVerification = asyncHandler(async (req, res) => {
  const result = await workerService.startVerification(req.user.id, req.body);

  return sendSuccess(res, result, 'Verification started successfully', 200);
});

module.exports = {
  upsertMyProfile,
  getMyProfile,
  uploadDocument,
  getMyDocuments,
  startVerification
};