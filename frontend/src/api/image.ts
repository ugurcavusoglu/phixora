import { addToHistory } from './mockHistory';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export interface ProcessOptions {
  scale?: 2 | 4;
  intensity?: 'low' | 'medium' | 'high';
  faceEnhance?: boolean;
}

// Frontend prototype mock: returns the original image as output.
export const processImage = (
  file: File,
  tool: Tool,
  _options: ProcessOptions = {},
) =>
  new Promise<{ data: { historyId: string; outputUrl: string } }>((resolve) => {
    const inputUrl = URL.createObjectURL(file);
    const outputUrl = URL.createObjectURL(file);
    const historyId = crypto.randomUUID();
    addToHistory({ id: historyId, tool, inputUrl, outputUrl, createdAt: new Date().toISOString() });
    setTimeout(() => resolve({ data: { historyId, outputUrl } }), 2500);
  });
