const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const {
  getMyClaims,
  evaluateClaimFraud
} = require('../controllers/claim.controller');

const router = express.Router();

router.get('/me', requireAuth, getMyClaims);
router.post('/:claimId/evaluate', evaluateClaimFraud);

module.exports = router;