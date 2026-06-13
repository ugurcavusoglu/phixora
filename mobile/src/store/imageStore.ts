import { create } from 'zustand';
import { API_BASE_URL } from '../api/client';
import type { Tool } from '../api/image';

interface ImageState {
  // local picked image uri (before)
  uri: string | null;
  tool: Tool | null;
  scale: 2 | 4;
  intensity: 'low' | 'medium' | 'high';
  faceEnhance: boolean;
  // result (after) — absolute URL on the backend
  outputUrl: string | null;
  // before image to show on the result screen (local uri or backend url)
  beforeUrl: string | null;
  setImage: (uri: string) => void;
  setTool: (tool: Tool) => void;
  setScale: (scale: 2 | 4) => void;
  setIntensity: (v: 'low' | 'medium' | 'high') => void;
  setFaceEnhance: (v: boolean) => void;
  setResult: (outputUrl: string) => void;
  loadHistoryItem: (item: { tool: Tool; inputUrl: string; outputUrl: string }) => void;
  reset: () => void;
}

// History stores relative paths (/outputs/..). Make them absolute for <Image>.
export const absolute = (path: string) =>
  path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

export const useImageStore = create<ImageState>((set) => ({
  uri: null,
  tool: null,
  scale: 4,
  intensity: 'medium',
  faceEnhance: false,
  outputUrl: null,
  beforeUrl: null,
  setImage: (uri) => set({ uri, beforeUrl: uri, outputUrl: null }),
  setTool: (tool) => set({ tool }),
  setScale: (scale) => set({ scale }),
  setIntensity: (intensity) => set({ intensity }),
  setFaceEnhance: (faceEnhance) => set({ faceEnhance }),
  setResult: (outputUrl) => set({ outputUrl: absolute(outputUrl) }),
  loadHistoryItem: (item) =>
    set({
      tool: item.tool,
      beforeUrl: absolute(item.inputUrl),
      outputUrl: absolute(item.outputUrl),
      uri: null,
    }),
  reset: () =>
    set({ uri: null, tool: null, scale: 4, intensity: 'medium', faceEnhance: false, outputUrl: null, beforeUrl: null }),
}));
