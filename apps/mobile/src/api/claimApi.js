import { apiClient } from './client';

export const getMyClaimsApi = async () => {
  const response = await apiClient.get('/claims/me');
  return response.data;
};