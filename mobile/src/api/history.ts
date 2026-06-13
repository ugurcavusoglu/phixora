import api from './client';

export interface HistoryItem {
  id: string;
  tool: string;
  inputUrl: string;
  outputUrl: string;
  createdAt: string;
}

export const getHistory = () => api.get<HistoryItem[]>('/history');
export const deleteHistoryItem = (id: string) => api.delete(`/history/${id}`);
