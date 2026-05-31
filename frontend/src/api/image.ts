import api from './client';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export const processImage = (file: File, tool: Tool) => {
  const form = new FormData();
  form.append('file', file);
  form.append('tool', tool);
  return api.post<{ historyId: string; outputUrl: string }>('/image/process', form);
};
