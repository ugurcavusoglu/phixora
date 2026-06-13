import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Backend base URL. On a real device, localhost won't work — set this to your
// computer's LAN IP (e.g. http://192.168.1.20:3000). Configurable via env.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10 * 60 * 1000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
