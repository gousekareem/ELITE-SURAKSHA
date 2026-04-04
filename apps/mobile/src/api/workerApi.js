import { apiClient } from './client';

export const getMyWorkerProfileApi = async () => {
  const response = await apiClient.get('/workers/me');
  return response.data;
};

export const saveWorkerProfileApi = async (payload) => {
  const response = await apiClient.post('/workers/profile', payload);
  return response.data;
};

export const startVerificationApi = async (payload) => {
  const response = await apiClient.post('/workers/verification/start', payload);
  return response.data;
};