import { apiClient } from './client';

export const reportsAPI = {
  getDashboard: () => apiClient.get('/reports/dashboard'),
};
