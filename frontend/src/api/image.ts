import api from './client';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export interface ProcessOptions {
  scale?: 2 | 4;
  intensity?: 'low' | 'medium' | 'high';
  faceEnhance?: boolean;
}

export const processImage = (file: File, tool: Tool, options: ProcessOptions = {}) => {
  const form = new FormData();
  form.append('file', file);
  form.append('tool', tool);
  if (options.scale) form.append('scale', String(options.scale));
  if (options.intensity) form.append('intensity', options.intensity);
  if (options.faceEnhance) form.append('faceEnhance', 'true');
  return api.post<{ historyId: string; outputUrl: string; remainingGems?: number }>('/image/process', form);
};
