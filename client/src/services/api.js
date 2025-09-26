import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
};

// Companies API
export const companiesAPI = {
  getAll: () => api.get('/companies'),
  create: (companyData) => api.post('/companies', companyData),
};

// Jobs API
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.patch(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Applications API
export const applicationsAPI = {
  getAll: () => api.get('/applications'),
  create: (applicationData) => api.post('/applications', applicationData),
};

export default api;