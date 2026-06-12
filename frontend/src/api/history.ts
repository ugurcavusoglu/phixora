import { getAll, remove } from './mockHistory';

export interface HistoryItem {
  id: string;
  tool: string;
  inputUrl: string;
  outputUrl: string;
  createdAt: string;
}

export const getHistory = () => Promise.resolve({ data: getAll() });
export const getHistoryItem = (id: string) => {
  const item = getAll().find((i) => i.id === id);
  return item ? Promise.resolve({ data: item }) : Promise.reject(new Error('Not found'));
};
export const deleteHistoryItem = (id: string) => {
  remove(id);
  return Promise.resolve({ data: {} });
};
