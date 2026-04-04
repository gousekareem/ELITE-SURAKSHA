import { apiClient } from './client';

export const getPolicyQuoteApi = async () => {
  const response = await apiClient.post('/policies/quote');
  return response.data;
};

export const getMyPolicyApi = async () => {
  const response = await apiClient.get('/policies/me');
  return response.data;
};

export const activatePolicyApi = async (payload = {}) => {
  const response = await apiClient.post('/policies/activate', payload);
  return response.data;
};