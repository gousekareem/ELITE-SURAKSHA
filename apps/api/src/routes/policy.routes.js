const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  getQuote,
  activatePolicy,
  getMyPolicy
} = require('../controllers/policy.controller');

const router = express.Router();

const activatePolicyValidator = (req) => {
  const errors = [];
  const body = req.body || {};

  if (body.coverageStart && Number.isNaN(new Date(body.coverageStart).getTime())) {
    errors.push({
      field: 'coverageStart',
      message: 'coverageStart must be a valid date'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

router.get('/me', requireAuth, getMyPolicy);
router.post('/quote', requireAuth, getQuote);
router.post('/activate', requireAuth, validate(activatePolicyValidator), activatePolicy);

module.exports = router;