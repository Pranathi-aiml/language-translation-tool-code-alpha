import api from './api';

export const postTranslation = async (text, source, target) => {
  const response = await api.post('/api/translate', { text, source, target });
  return response.data;
};

export const getHistory = async (searchQuery = '') => {
  const params = searchQuery ? { search: searchQuery } : {};
  const response = await api.get('/history', { params });
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};
