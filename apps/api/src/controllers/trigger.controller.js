const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const triggerService = require('../services/trigger.service');

const createTriggerEvent = asyncHandler(async (req, res) => {
  const result = await triggerService.createTriggerEventAndClaims(req.body);

  return sendSuccess(res, result, 'Trigger event processed successfully', 201);
});

const getTriggerEvents = asyncHandler(async (req, res) => {
  const result = await triggerService.getTriggerEvents();

  return sendSuccess(res, result, 'Trigger events fetched successfully', 200);
});

module.exports = {
  createTriggerEvent,
  getTriggerEvents
};