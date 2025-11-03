import { apiClient } from './client';

export const leavesAPI = {
  getAll: (params) => apiClient.get('/leaves', params),
  apply: (data) => apiClient.post('/leaves', data),
  update: (id, data) => apiClient.put(`/leaves/${id}`, data),
  getTypes: () => apiClient.get('/leaves/types'),
  getBalance: (employeeId) => apiClient.get(`/leaves/balance/${employeeId}`),
};
