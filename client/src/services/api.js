const API_BASE_URL = 'https://job-board-app-avqf.onrender.com/api';

const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw { response: { data: error } };
  }
  
  return { data: await response.json() };
};

// Users API
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  create: (userData) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// Companies API
export const companiesAPI = {
  getAll: () => fetchAPI('/companies'),
  create: (companyData) => fetchAPI('/companies', {
    method: 'POST',
    body: JSON.stringify(companyData),
  }),
};

// Jobs API
export const jobsAPI = {
  getAll: () => fetchAPI('/jobs'),
  getById: (id) => fetchAPI(`/jobs/${id}`),
  create: (jobData) => fetchAPI('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
  update: (id, jobData) => fetchAPI(`/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(jobData),
  }),
  delete: (id) => fetchAPI(`/jobs/${id}`, {
    method: 'DELETE',
  }),
};

// Applications API
export const applicationsAPI = {
  getAll: () => fetchAPI('/applications'),
  create: (applicationData) => fetchAPI('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
};