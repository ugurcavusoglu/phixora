import { create } from 'zustand';
import { type Tool } from '../api/image';

interface ImageState {
  file: File | null;
  tool: Tool | null;
  outputUrl: string | null;
  historyId: string | null;
  setFile: (file: File) => void;
  setTool: (tool: Tool) => void;
  setResult: (outputUrl: string, historyId: string) => void;
  reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  file: null,
  tool: null,
  outputUrl: null,
  historyId: null,
  setFile: (file) => set({ file }),
  setTool: (tool) => set({ tool }),
  setResult: (outputUrl, historyId) => set({ outputUrl, historyId }),
  reset: () => set({ file: null, tool: null, outputUrl: null, historyId: null }),
}));
