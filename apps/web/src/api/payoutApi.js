import { apiClient } from './client';

export const getMyPayoutsApi = async () => {
  const response = await apiClient.get('/payouts/me');
  return response.data;
};