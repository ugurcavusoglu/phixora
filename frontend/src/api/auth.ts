import api from './client';

export const register = (name: string, email: string, password: string) =>
  api.post<{ access_token: string }>('/auth/register', { name, email, password });

export const login = (email: string, password: string) =>
  api.post<{ access_token: string }>('/auth/login', { email, password });

export const getMe = () =>
  api.get<{ id: string; name: string; email: string }>('/auth/me');
