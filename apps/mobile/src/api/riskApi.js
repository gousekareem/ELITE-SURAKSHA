import { apiClient } from './client';

export const getLatestRiskApi = async () => {
  const response = await apiClient.get('/risk/me/latest');
  return response.data;
};

export const recalculateRiskApi = async () => {
  const response = await apiClient.post('/risk/recalculate');
  return response.data;
};