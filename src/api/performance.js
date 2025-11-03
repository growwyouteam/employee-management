import { apiClient } from './client';

export const performanceAPI = {
  getGoals: (params) => apiClient.get('/performance/goals', params),
  createGoal: (data) => apiClient.post('/performance/goals', data),
  getReviews: (params) => apiClient.get('/performance/reviews', params),
  getFeedback: (params) => apiClient.get('/performance/feedback', params),
};
