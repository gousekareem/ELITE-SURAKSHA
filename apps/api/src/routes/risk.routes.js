const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const {
  recalculateRisk,
  getLatestRiskSnapshot
} = require('../controllers/risk.controller');

const router = express.Router();

router.post('/recalculate', requireAuth, recalculateRisk);
router.get('/me/latest', requireAuth, getLatestRiskSnapshot);

module.exports = router;