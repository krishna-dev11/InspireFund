import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  me: () => api.get('/api/user/me')
};

export const campaignApi = {
  list: (params) => api.get('/api/campaign/all', { params }),
  get: (id) => api.get(`/api/campaign/${id}`),
  create: (payload) => api.post('/api/campaign/create', payload),
  contributions: (id) => api.get(`/api/campaign/${id}/contributions`)
};

export const paymentApi = {
  createOrder: (payload) => api.post('/api/payment/create-order', payload),
  verify: (payload) => api.post('/api/payment/verify', payload)
};

export const userApi = {
  contributions: () => api.get('/api/user/contributions'),
  campaigns: () => api.get('/api/user/campaigns')
};

export const adminApi = {
  stats: () => api.get('/api/admin/stats'),
  withdraw: (payload) => api.post('/api/admin/withdraw', payload)
};

export default api;
