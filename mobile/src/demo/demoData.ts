import type { Tool } from '../api/image';

export interface DemoSample {
  id: string;
  label: string;
  original: ReturnType<typeof require>;
  results: Record<Tool, ReturnType<typeof require>>;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    original: require('../../assets/demo/portrait.jpeg'),
    results: {
      'super-resolution': require('../../assets/demo/portrait-super-resolution.png'),
      'remove-noise': require('../../assets/demo/portrait-remove-noise.png'),
      'remove-background': require('../../assets/demo/portrait-remove-background.png'),
    },
  },
  {
    id: 'pet',
    label: 'Pet',
    original: require('../../assets/demo/pet.jpeg'),
    results: {
      'super-resolution': require('../../assets/demo/pet-super-resolution.png'),
      'remove-noise': require('../../assets/demo/pet-remove-noise.png'),
      'remove-background': require('../../assets/demo/pet-remove-background.png'),
    },
  },
  {
    id: 'car',
    label: 'Car',
    original: require('../../assets/demo/product.jpg'),
    results: {
      'super-resolution': require('../../assets/demo/product-super-resolution.png'),
      'remove-noise': require('../../assets/demo/product-remove-noise.png'),
      'remove-background': require('../../assets/demo/product-remove-background.png'),
    },
  },
];
