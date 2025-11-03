import { apiClient } from './client';

export const adminAPI = {
  getDepartments: () => apiClient.get('/admin/departments'),
  getDesignations: () => apiClient.get('/admin/designations'),
};
