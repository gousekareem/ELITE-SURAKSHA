import { apiClient } from './client';

export const uploadWorkerDocumentApi = async (type, file) => {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('document', file);

  const response = await apiClient.post('/workers/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const getWorkerDocumentsApi = async () => {
  const response = await apiClient.get('/workers/documents');
  return response.data;
};