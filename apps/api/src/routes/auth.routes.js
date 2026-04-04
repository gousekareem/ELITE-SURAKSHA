const express = require('express');
const { sendOtp, verifyOtp, getMe } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

const sendOtpValidator = (req) => {
  const errors = [];

  if (!req.body || typeof req.body.phone !== 'string' || !req.body.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const verifyOtpValidator = (req) => {
  const errors = [];

  if (!req.body || typeof req.body.phone !== 'string' || !req.body.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  }

  if (!req.body || typeof req.body.otp !== 'string' || !req.body.otp.trim()) {
    errors.push({ field: 'otp', message: 'OTP is required' });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

router.post('/send-otp', validate(sendOtpValidator), sendOtp);
router.post('/verify-otp', validate(verifyOtpValidator), verifyOtp);
router.get('/me', requireAuth, getMe);

module.exports = router;