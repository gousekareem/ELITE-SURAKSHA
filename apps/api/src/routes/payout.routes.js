const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const {
  processPayout,
  getMyPayouts
} = require('../controllers/payout.controller');

const router = express.Router();

router.get('/me', requireAuth, getMyPayouts);
router.post('/:claimId/process', processPayout);

module.exports = router;