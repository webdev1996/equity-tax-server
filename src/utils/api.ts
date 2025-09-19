import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (userData: any) =>
    api.post('/auth/signup', userData),
  logout: () =>
    api.post('/auth/logout'),
  refreshToken: () =>
    api.post('/auth/refresh'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

export const userAPI = {
  getProfile: () =>
    api.get('/user/profile'),
  updateProfile: (data: any) =>
    api.put('/user/profile', data),
  changePassword: (data: any) =>
    api.put('/user/change-password', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const taxAPI = {
  getReturns: () =>
    api.get('/tax/returns'),
  getReturn: (id: string) =>
    api.get(`/tax/returns/${id}`),
  createReturn: (data: any) =>
    api.post('/tax/returns', data),
  updateReturn: (id: string, data: any) =>
    api.put(`/tax/returns/${id}`, data),
  submitReturn: (id: string) =>
    api.post(`/tax/returns/${id}/submit`),
  deleteReturn: (id: string) =>
    api.delete(`/tax/returns/${id}`),
  downloadReturn: (id: string) =>
    api.get(`/tax/returns/${id}/download`, { responseType: 'blob' }),
};

export const documentAPI = {
  getDocuments: (returnId?: string) =>
    api.get('/documents', { params: { returnId } }),
  uploadDocument: (file: File, returnId?: string) => {
    const formData = new FormData();
    formData.append('document', file);
    if (returnId) formData.append('returnId', returnId);
    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument: (id: string) =>
    api.delete(`/documents/${id}`),
  downloadDocument: (id: string) =>
    api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export const adminAPI = {
  getUsers: (params?: any) =>
    api.get('/admin/users', { params }),
  getUser: (id: string) =>
    api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) =>
    api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),
  getReturns: (params?: any) =>
    api.get('/admin/returns', { params }),
  reviewReturn: (id: string, action: 'approve' | 'reject', comment?: string) =>
    api.post(`/admin/returns/${id}/review`, { action, comment }),
  getAnalytics: (params?: any) =>
    api.get('/admin/analytics', { params }),
  getSettings: () =>
    api.get('/admin/settings'),
  updateSettings: (data: any) =>
    api.put('/admin/settings', data),
};

export default api;
