const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const authService = require('../services/auth.service');

const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendOtp(req.body.phone);
  return sendSuccess(res, result, 'OTP generated successfully', 201);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body.phone, req.body.otp);
  return sendSuccess(res, result, 'OTP verified successfully');
});

const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.user.id);
  return sendSuccess(res, result, 'Authenticated user fetched successfully');
});

module.exports = {
  sendOtp,
  verifyOtp,
  getMe
};