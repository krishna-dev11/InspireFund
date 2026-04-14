import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// 🔥 FIXED (string template bug)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// ================= AUTH =================
export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),

  // 🔥 NEW
  googleLogin: (payload) => api.post('/api/auth/google', payload),

  me: () => api.get('/api/user/me')
};

// ================= CAMPAIGN =================
export const campaignApi = {
  list: (params) => api.get('/api/campaign/all', { params }),
  get: (id) => api.get(`/api/campaign/${id}`),
  // delete: (id) => api.delete(`/api/campaign/delete/${id}`),
  create: (formData) =>
    api.post('/api/campaign/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  contributions: (id) => api.get(`/api/campaign/${id}/contributions`),

  // 🔥 ADD THIS
  delete: (id) => api.delete(`/api/campaign/delete/${id}`)
};

// ================= PAYMENT =================
export const paymentApi = {
  createOrder: (payload) => api.post('/api/payment/create-order', payload),
  verify: (payload) => api.post('/api/payment/verify', payload)
};

// ================= USER =================
export const userApi = {
  contributions: () => api.get('/api/user/contributions'),
  campaigns: () => api.get('/api/user/campaigns')
};

// ================= ADMIN =================
export const adminApi = {
  stats: () => api.get('/api/admin/stats'),
  withdraw: (payload) => api.post('/api/admin/withdraw', payload),

  // 🔥 NEW (approval system)
  pending: () => api.get('/api/admin/pending-campaigns'),
  approve: (id) => api.patch(`/api/admin/approve/${id}`),
  reject: (id) => api.patch(`/api/admin/reject/${id}`)
};

export default api;


