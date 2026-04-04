const express = require('express');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  getDashboard,
  getWorkers,
  getPolicies,
  getClaims,
  getPayouts,
  reviewClaim,
  updateWorkerVerification
} = require('../controllers/admin.controller');

const router = express.Router();

const reviewClaimValidator = (req) => {
  const errors = [];
  const body = req.body || {};

  if (!['approve', 'reject'].includes(body.action)) {
    errors.push({
      field: 'action',
      message: 'action must be approve or reject'
    });
  }

  if (body.reviewNote !== undefined && typeof body.reviewNote !== 'string') {
    errors.push({
      field: 'reviewNote',
      message: 'reviewNote must be a string'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const verificationUpdateValidator = (req) => {
  const errors = [];
  const body = req.body || {};
  const allowed = ['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED'];

  if (body.kycStatus !== undefined && !allowed.includes(body.kycStatus)) {
    errors.push({
      field: 'kycStatus',
      message: `kycStatus must be one of: ${allowed.join(', ')}`
    });
  }

  if (body.employmentStatus !== undefined && !allowed.includes(body.employmentStatus)) {
    errors.push({
      field: 'employmentStatus',
      message: `employmentStatus must be one of: ${allowed.join(', ')}`
    });
  }

  if (body.kycStatus === undefined && body.employmentStatus === undefined) {
    errors.push({
      field: 'verification',
      message: 'Provide kycStatus or employmentStatus'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

router.use(requireAuth, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/workers', getWorkers);
router.get('/policies', getPolicies);
router.get('/claims', getClaims);
router.get('/payouts', getPayouts);

router.patch('/claims/:claimId/review', validate(reviewClaimValidator), reviewClaim);
router.patch(
  '/workers/:workerProfileId/verification',
  validate(verificationUpdateValidator),
  updateWorkerVerification
);

module.exports = router;