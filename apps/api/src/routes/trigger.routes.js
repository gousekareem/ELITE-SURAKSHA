const express = require('express');
const validate = require('../middlewares/validate');
const {
  createTriggerEvent,
  getTriggerEvents
} = require('../controllers/trigger.controller');

const router = express.Router();

const triggerEventValidator = (req) => {
  const errors = [];
  const body = req.body || {};
  const allowedTriggerTypes = [
    'HEAVY_RAIN',
    'HAZARDOUS_AQI',
    'EXTREME_HEAT',
    'FLOOD_ALERT',
    'CURFEW'
  ];

  if (typeof body.triggerType !== 'string' || !allowedTriggerTypes.includes(body.triggerType)) {
    errors.push({
      field: 'triggerType',
      message: `triggerType must be one of: ${allowedTriggerTypes.join(', ')}`
    });
  }

  if (typeof body.city !== 'string' || !body.city.trim()) {
    errors.push({
      field: 'city',
      message: 'city is required'
    });
  }

  if (body.thresholdValue === undefined || body.thresholdValue === null || body.thresholdValue === '') {
    errors.push({
      field: 'thresholdValue',
      message: 'thresholdValue is required'
    });
  }

  if (body.actualValue === undefined || body.actualValue === null || body.actualValue === '') {
    errors.push({
      field: 'actualValue',
      message: 'actualValue is required'
    });
  }

  if (body.detectedAt && Number.isNaN(new Date(body.detectedAt).getTime())) {
    errors.push({
      field: 'detectedAt',
      message: 'detectedAt must be a valid date'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

router.get('/events', getTriggerEvents);
router.post('/events', validate(triggerEventValidator), createTriggerEvent);

module.exports = router;