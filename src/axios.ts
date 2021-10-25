import axios from 'axios';

const API = axios.create({
  baseURL: "https://fast-oasis-18308.herokuapp.com/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
API.interceptors.request.use(config => {
  const token: string | null = localStorage.getItem('token');
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
  }
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
export default API