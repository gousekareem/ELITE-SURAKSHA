import { apiClient } from './client';

export const getAdminDashboardApi = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const getAdminWorkersApi = async () => {
  const response = await apiClient.get('/admin/workers');
  return response.data;
};

export const getAdminClaimsApi = async () => {
  const response = await apiClient.get('/admin/claims');
  return response.data;
};

export const getAdminPayoutsApi = async () => {
  const response = await apiClient.get('/admin/payouts');
  return response.data;
};

export const updateWorkerVerificationApi = async (workerProfileId, payload) => {
  const response = await apiClient.patch(`/admin/workers/${workerProfileId}/verification`, payload);
  return response.data;
};

export const reviewClaimApi = async (claimId, payload) => {
  const response = await apiClient.patch(`/admin/claims/${claimId}/review`, payload);
  return response.data;
};

export const processPayoutApi = async (claimId) => {
  const response = await apiClient.post(`/payouts/${claimId}/process`);
  return response.data;
};