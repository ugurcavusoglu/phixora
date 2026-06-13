import api from './client';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export interface ProcessOptions {
  scale?: 2 | 4;
  intensity?: 'low' | 'medium' | 'high';
  faceEnhance?: boolean;
}

// React Native FormData takes { uri, name, type } for files.
export const processImage = (
  uri: string,
  tool: Tool,
  options: ProcessOptions = {},
) => {
  const form = new FormData();
  const name = uri.split('/').pop() || 'image.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  form.append('file', { uri, name, type } as any);
  form.append('tool', tool);
  if (options.scale) form.append('scale', String(options.scale));
  if (options.intensity) form.append('intensity', options.intensity);
  if (options.faceEnhance) form.append('faceEnhance', 'true');

  return api.post<{ historyId: string; outputUrl: string }>('/image/process', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
