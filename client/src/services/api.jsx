import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Use the relative path for the proxy
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
