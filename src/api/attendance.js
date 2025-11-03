import { apiClient } from './client';

export const attendanceAPI = {
  getAll: (params) => apiClient.get('/attendance', params),
  mark: (data) => apiClient.post('/attendance', data),
  getSummary: (employeeId) => apiClient.get(`/attendance/summary`, { employeeId }),
};
