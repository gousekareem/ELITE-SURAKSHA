const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

const normalizeOptionalDecimal = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return null;
  }

  return num;
};

const ensureWorkerUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true }
  });

  if (!existingUser) {
    throw new AppError('Authenticated user not found', 404);
  }

  if (existingUser.role !== 'WORKER') {
    throw new AppError('Only worker accounts can perform this action', 403);
  }

  return existingUser;
};

const upsertWorkerProfile = async (userId, payload) => {
  const {
    fullName,
    dateOfBirth,
    primaryCity,
    homeLatitude,
    homeLongitude,
    workPlatform,
    aadhaarHash,
    autopayEnabled
  } = payload;

  const existingUser = await ensureWorkerUser(userId);

  const profileData = {
    fullName: fullName.trim(),
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    primaryCity: primaryCity.trim(),
    homeLatitude: normalizeOptionalDecimal(homeLatitude),
    homeLongitude: normalizeOptionalDecimal(homeLongitude),
    workPlatform: workPlatform.trim(),
    aadhaarHash: aadhaarHash ? aadhaarHash.trim() : null,
    autopayEnabled: Boolean(autopayEnabled)
  };

  let workerProfile;

  if (existingUser.workerProfile) {
    workerProfile = await prisma.workerProfile.update({
      where: { userId },
      data: profileData
    });
  } else {
    workerProfile = await prisma.workerProfile.create({
      data: {
        userId,
        ...profileData
      }
    });
  }

  return workerProfile;
};

const getCurrentWorkerProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true }
  });

  if (!user) {
    throw new AppError('Authenticated user not found', 404);
  }

  if (!user.workerProfile) {
    return null;
  }

  return user.workerProfile;
};

const uploadWorkerDocument = async (userId, file, type) => {
  const user = await ensureWorkerUser(userId);

  if (!user.workerProfile) {
    throw new AppError('Create worker profile before uploading documents', 400);
  }

  if (!file) {
    throw new AppError('Document file is required', 400);
  }

  const document = await prisma.workerDocument.create({
    data: {
      workerProfileId: user.workerProfile.id,
      type,
      fileUrl: file.path.replace(/\\/g, '/'),
      extractedText: null,
      reviewStatus: 'PENDING'
    }
  });

  return document;
};

const getWorkerDocuments = async (userId) => {
  const user = await ensureWorkerUser(userId);

  if (!user.workerProfile) {
    throw new AppError('Worker profile not found', 404);
  }

  const documents = await prisma.workerDocument.findMany({
    where: {
      workerProfileId: user.workerProfile.id
    },
    orderBy: {
      uploadedAt: 'desc'
    }
  });

  return documents;
};

const startVerification = async (userId, payload) => {
  const user = await ensureWorkerUser(userId);

  if (!user.workerProfile) {
    throw new AppError('Create worker profile before starting verification', 400);
  }

  const { kycRequested, employmentRequested } = payload;

  const updateData = {};

  if (kycRequested === true) {
    updateData.kycStatus = 'PENDING';
  }

  if (employmentRequested === true) {
    updateData.employmentStatus = 'PENDING';
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError('At least one verification flow must be requested', 400);
  }

  const updatedProfile = await prisma.workerProfile.update({
    where: { id: user.workerProfile.id },
    data: updateData
  });

  return updatedProfile;
};

module.exports = {
  upsertWorkerProfile,
  getCurrentWorkerProfile,
  uploadWorkerDocument,
  getWorkerDocuments,
  startVerification
};