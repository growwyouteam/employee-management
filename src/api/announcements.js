import { apiClient } from './client';

export const announcementsAPI = {
  getAll: () => apiClient.get('/announcements'),
  create: (data) => apiClient.post('/announcements', data),
};

export const messagesAPI = {
  getAll: (params) => apiClient.get('/messages', params),
  send: (data) => apiClient.post('/messages', data),
};
