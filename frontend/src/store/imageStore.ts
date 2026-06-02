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
  setFile: (file: File) => void;
  setTool: (tool: Tool) => void;
  setScale: (scale: 2 | 4) => void;
  setIntensity: (intensity: 'low' | 'medium' | 'high') => void;
  setFaceEnhance: (v: boolean) => void;
  setResult: (outputUrl: string, historyId: string) => void;
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
  setFile: (file) => set({ file }),
  setTool: (tool) => set({ tool }),
  setScale: (scale) => set({ scale }),
  setIntensity: (intensity) => set({ intensity }),
  setFaceEnhance: (faceEnhance) => set({ faceEnhance }),
  setResult: (outputUrl, historyId) => set({ outputUrl, historyId }),
  reset: () => set({ file: null, tool: null, scale: 4, intensity: 'medium', faceEnhance: false, outputUrl: null, historyId: null }),
}));
