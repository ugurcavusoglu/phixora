import { type HistoryItem } from './history';

// In-memory history for the frontend prototype (no backend).
// Survives page navigation within the same session; cleared on hard refresh.
let items: HistoryItem[] = [];
let lastAddedAt = 0;
let lastAddedTool = '';

// Guards against React StrictMode double-invoking effects: if the same tool is
// added within 200 ms, treat it as a duplicate and skip the second write.
export const addToHistory = (item: HistoryItem) => {
  const now = Date.now();
  if (now - lastAddedAt < 200 && lastAddedTool === item.tool) return;
  lastAddedAt = now;
  lastAddedTool = item.tool;
  items = [item, ...items];
};

export const getAll = () => [...items];
export const remove = (id: string) => { items = items.filter((i) => i.id !== id); };
