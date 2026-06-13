import { create } from 'zustand';
import { type Tool } from '../api/image';

interface ImageState {
  file: File | null;
  tool: Tool | null;
  scale: 2 | 4;
  intensity: 'low' | 'medium' | 'high';
  faceEnhance: boolean;
  outputUrl: string | null;
  historyId: string | null;
  // Demo (guest) mode: no real File, no backend call.
  isDemo: boolean;
  demoOriginalUrl: string | null;
  // When viewing a past history item, its original (before) image URL.
  viewBeforeUrl: string | null;
  setFile: (file: File) => void;
  setTool: (tool: Tool) => void;
  setScale: (scale: 2 | 4) => void;
  setIntensity: (intensity: 'low' | 'medium' | 'high') => void;
  setFaceEnhance: (v: boolean) => void;
  setResult: (outputUrl: string, historyId: string) => void;
  startDemo: (originalUrl: string) => void;
  loadHistoryItem: (item: { tool: Tool; inputUrl: string; outputUrl: string; id: string }) => void;
  reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  file: null,
  tool: null,
  scale: 4,
  intensity: 'medium',
  faceEnhance: false,
  outputUrl: null,
  historyId: null,
  isDemo: false,
  demoOriginalUrl: null,
  viewBeforeUrl: null,
  setFile: (file) => set({ file, isDemo: false, demoOriginalUrl: null, viewBeforeUrl: null }),
  setTool: (tool) => set({ tool }),
  setScale: (scale) => set({ scale }),
  setIntensity: (intensity) => set({ intensity }),
  setFaceEnhance: (faceEnhance) => set({ faceEnhance }),
  setResult: (outputUrl, historyId) => set({ outputUrl, historyId }),
  startDemo: (originalUrl) =>
    set({ isDemo: true, demoOriginalUrl: originalUrl, file: null, tool: null, outputUrl: null, historyId: null, viewBeforeUrl: null }),
  loadHistoryItem: (item) =>
    set({
      tool: item.tool,
      outputUrl: item.outputUrl,
      viewBeforeUrl: item.inputUrl,
      historyId: item.id,
      file: null,
      isDemo: false,
      demoOriginalUrl: null,
    }),
  reset: () =>
    set({ file: null, tool: null, scale: 4, intensity: 'medium', faceEnhance: false, outputUrl: null, historyId: null, isDemo: false, demoOriginalUrl: null, viewBeforeUrl: null }),
}));
