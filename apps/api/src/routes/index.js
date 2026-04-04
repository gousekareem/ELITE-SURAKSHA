const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const workerRoutes = require('./worker.routes');
const policyRoutes = require('./policy.routes');
const riskRoutes = require('./risk.routes');
const triggerRoutes = require('./trigger.routes');
const claimRoutes = require('./claim.routes');
const payoutRoutes = require('./payout.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/workers', workerRoutes);
router.use('/policies', policyRoutes);
router.use('/risk', riskRoutes);
router.use('/triggers', triggerRoutes);
router.use('/claims', claimRoutes);
router.use('/payouts', payoutRoutes);
router.use('/admin', adminRoutes);

module.exports = router;