const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../config/upload');
const {
  upsertMyProfile,
  getMyProfile,
  uploadDocument,
  getMyDocuments,
  startVerification
} = require('../controllers/worker.controller');

const router = express.Router();

const workerProfileValidator = (req) => {
  const errors = [];
  const body = req.body || {};

  if (typeof body.fullName !== 'string' || !body.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (typeof body.primaryCity !== 'string' || !body.primaryCity.trim()) {
    errors.push({ field: 'primaryCity', message: 'Primary city is required' });
  }

  if (typeof body.workPlatform !== 'string' || !body.workPlatform.trim()) {
    errors.push({ field: 'workPlatform', message: 'Work platform is required' });
  }

  if (body.dateOfBirth && Number.isNaN(new Date(body.dateOfBirth).getTime())) {
    errors.push({ field: 'dateOfBirth', message: 'dateOfBirth must be a valid date' });
  }

  if (body.homeLatitude !== undefined && body.homeLatitude !== null && body.homeLatitude !== '') {
    if (Number.isNaN(Number(body.homeLatitude))) {
      errors.push({ field: 'homeLatitude', message: 'homeLatitude must be numeric' });
    }
  }

  if (body.homeLongitude !== undefined && body.homeLongitude !== null && body.homeLongitude !== '') {
    if (Number.isNaN(Number(body.homeLongitude))) {
      errors.push({ field: 'homeLongitude', message: 'homeLongitude must be numeric' });
    }
  }

  if (body.autopayEnabled !== undefined && typeof body.autopayEnabled !== 'boolean') {
    errors.push({ field: 'autopayEnabled', message: 'autopayEnabled must be boolean' });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const documentUploadValidator = (req) => {
  const errors = [];
  const body = req.body || {};
  const allowedTypes = ['KYC_ID', 'EMPLOYMENT_SCREENSHOT', 'BANK_PROOF', 'PROFILE_PHOTO'];

  if (typeof body.type !== 'string' || !allowedTypes.includes(body.type)) {
    errors.push({
      field: 'type',
      message: `type must be one of: ${allowedTypes.join(', ')}`
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const verificationStartValidator = (req) => {
  const errors = [];
  const body = req.body || {};

  if (body.kycRequested !== true && body.employmentRequested !== true) {
    errors.push({
      field: 'verification',
      message: 'Set kycRequested or employmentRequested to true'
    });
  }

  if (body.kycRequested !== undefined && typeof body.kycRequested !== 'boolean') {
    errors.push({ field: 'kycRequested', message: 'kycRequested must be boolean' });
  }

  if (body.employmentRequested !== undefined && typeof body.employmentRequested !== 'boolean') {
    errors.push({
      field: 'employmentRequested',
      message: 'employmentRequested must be boolean'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

router.get('/me', requireAuth, getMyProfile);
router.post('/profile', requireAuth, validate(workerProfileValidator), upsertMyProfile);

router.get('/documents', requireAuth, getMyDocuments);
router.post(
  '/documents',
  requireAuth,
  upload.single('document'),
  validate(documentUploadValidator),
  uploadDocument
);

router.post(
  '/verification/start',
  requireAuth,
  validate(verificationStartValidator),
  startVerification
);

module.exports = router;