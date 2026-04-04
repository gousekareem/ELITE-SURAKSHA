const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { CITY_RISK_PROFILES } = require('../constants/risk.constants');

const ensureWorkerWithProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true }
  });

  if (!user) {
    throw new AppError('Authenticated user not found', 404);
  }

  if (user.role !== 'WORKER') {
    throw new AppError('Only worker accounts can perform this action', 403);
  }

  if (!user.workerProfile) {
    throw new AppError('Worker profile not found. Complete onboarding first.', 400);
  }

  return user;
};

const clampScore = (value) => {
  if (value < 0) return 0;
  if (value > 10) return 10;
  return Number(value.toFixed(2));
};

const getCityProfile = (city) => {
  const normalized = (city || '').trim().toLowerCase();
  return CITY_RISK_PROFILES[normalized] || CITY_RISK_PROFILES.default;
};

const calculateRiskComponents = (workerProfile) => {
  const cityProfile = getCityProfile(workerProfile.primaryCity);
  const platform = (workerProfile.workPlatform || '').trim().toLowerCase();

  let weatherRiskScore = cityProfile.weatherRiskScore;
  let aqiRiskScore = cityProfile.aqiRiskScore;
  let heatRiskScore = cityProfile.heatRiskScore;
  let floodRiskScore = cityProfile.floodRiskScore;

  if (platform.includes('zepto') || platform.includes('blinkit')) {
    weatherRiskScore += 0.5;
    heatRiskScore += 0.5;
  }

  if (platform.includes('swiggy') || platform.includes('zomato')) {
    weatherRiskScore += 0.25;
    aqiRiskScore += 0.25;
  }

  if (workerProfile.autopayEnabled) {
    weatherRiskScore -= 0.2;
    aqiRiskScore -= 0.2;
    heatRiskScore -= 0.2;
    floodRiskScore -= 0.2;
  }

  if (workerProfile.kycStatus === 'VERIFIED') {
    aqiRiskScore -= 0.2;
    weatherRiskScore -= 0.2;
  }

  if (workerProfile.employmentStatus === 'VERIFIED') {
    heatRiskScore -= 0.2;
    floodRiskScore -= 0.2;
  }

  weatherRiskScore = clampScore(weatherRiskScore);
  aqiRiskScore = clampScore(aqiRiskScore);
  heatRiskScore = clampScore(heatRiskScore);
  floodRiskScore = clampScore(floodRiskScore);

  const totalRiskScore = clampScore(
    weatherRiskScore * 0.30 +
    aqiRiskScore * 0.20 +
    heatRiskScore * 0.25 +
    floodRiskScore * 0.25
  );

  let recommendedPremium = 20 + totalRiskScore * 1.8;

  if (workerProfile.autopayEnabled) {
    recommendedPremium -= 2;
  }

  if (workerProfile.kycStatus === 'VERIFIED') {
    recommendedPremium -= 1;
  }

  if (workerProfile.employmentStatus === 'VERIFIED') {
    recommendedPremium -= 1;
  }

  if (recommendedPremium < 20) {
    recommendedPremium = 20;
  }

  recommendedPremium = Number(recommendedPremium.toFixed(2));

  return {
    city: workerProfile.primaryCity,
    weatherRiskScore,
    aqiRiskScore,
    heatRiskScore,
    floodRiskScore,
    totalRiskScore,
    recommendedPremium
  };
};

const recalculateRisk = async (userId) => {
  const user = await ensureWorkerWithProfile(userId);
  const workerProfile = user.workerProfile;

  const calculated = calculateRiskComponents(workerProfile);

  const snapshot = await prisma.riskSnapshot.create({
    data: {
      workerProfileId: workerProfile.id,
      city: calculated.city,
      weatherRiskScore: calculated.weatherRiskScore,
      aqiRiskScore: calculated.aqiRiskScore,
      heatRiskScore: calculated.heatRiskScore,
      floodRiskScore: calculated.floodRiskScore,
      totalRiskScore: calculated.totalRiskScore,
      recommendedPremium: calculated.recommendedPremium
    }
  });

  return snapshot;
};

const getLatestRiskSnapshot = async (userId) => {
  const user = await ensureWorkerWithProfile(userId);

  const snapshot = await prisma.riskSnapshot.findFirst({
    where: {
      workerProfileId: user.workerProfile.id
    },
    orderBy: {
      generatedAt: 'desc'
    }
  });

  return snapshot;
};

module.exports = {
  calculateRiskComponents,
  recalculateRisk,
  getLatestRiskSnapshot
};