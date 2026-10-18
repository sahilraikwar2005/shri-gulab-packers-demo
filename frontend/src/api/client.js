import axios, { AxiosError, AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || undefined,
  withCredentials: import.meta.env.VITE_DATA_SOURCE === 'api',
});

api.interceptors.request.use((config) => {
  const message = import.meta.env.VITE_DATA_SOURCE === 'api'
    ? (!import.meta.env.VITE_API_URL ? 'Backend submissions are unavailable until VITE_API_URL is configured.' : null)
    : 'This action is unavailable in the frontend-only site. Connect the backend API to submit this request.';

  if (!message) return config;

  const error = new AxiosError(message, AxiosError.ERR_BAD_REQUEST, config);
  error.response = {
    data: { message },
    status: 503,
    statusText: 'Service Unavailable',
    headers: new AxiosHeaders(),
    config,
  };
  return Promise.reject(error);
});

export default api;