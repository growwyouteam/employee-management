import { apiClient } from './client';

export const payrollAPI = {
  getPayslips: (params) => apiClient.get('/payroll/payslips', params),
  getStructure: (employeeId) => apiClient.get(`/payroll/structure/${employeeId}`),
  getSummary: () => apiClient.get('/payroll/summary'),
};
