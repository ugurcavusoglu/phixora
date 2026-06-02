import type { Tool } from '../api/image';

/**
 * Demo (guest) mode data. No backend / Replicate calls are made — guests pick
 * one of these sample images and see pre-baked before/after results.
 *
 * Placeholders are inline SVGs for now. To use real images, drop files into
 * frontend/public/demo/ and replace the data-URIs with paths like
 * "/demo/portrait-original.jpg" and "/demo/portrait-super-resolution.jpg".
 */

export interface DemoSample {
  id: string;
  label: string;
  original: string;
  results: Record<Tool, string>;
}

// Simple labelled placeholder so the flow is visible before real assets exist.
const placeholder = (label: string, bg: string, fg = '#F4F4F5') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
      <rect width="640" height="400" fill="${bg}"/>
      <text x="50%" y="50%" fill="${fg}" font-family="sans-serif" font-size="28"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    original: placeholder('Portrait — Original', '#1E1E2E'),
    results: {
      'super-resolution': placeholder('Portrait — 4x Upscaled', '#2A1E3E'),
      'remove-noise': placeholder('Portrait — Denoised', '#1E2A3E'),
      'remove-background': placeholder('Portrait — No Background', '#0A2A24'),
    },
  },
  {
    id: 'landscape',
    label: 'Landscape',
    original: placeholder('Landscape — Original', '#1E1E2E'),
    results: {
      'super-resolution': placeholder('Landscape — 4x Upscaled', '#2A1E3E'),
      'remove-noise': placeholder('Landscape — Denoised', '#1E2A3E'),
      'remove-background': placeholder('Landscape — No Background', '#0A2A24'),
    },
  },
  {
    id: 'oldphoto',
    label: 'Old Photo',
    original: placeholder('Old Photo — Original', '#1E1E2E'),
    results: {
      'super-resolution': placeholder('Old Photo — 4x Upscaled', '#2A1E3E'),
      'remove-noise': placeholder('Old Photo — Denoised', '#1E2A3E'),
      'remove-background': placeholder('Old Photo — No Background', '#0A2A24'),
    },
  },
];
