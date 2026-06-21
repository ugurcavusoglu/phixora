import api from './client';

export type PackageId = 'starter' | 'popular' | 'pro';

export const purchaseGems = (packageId: PackageId) =>
  api.post<{ gems: number; added: number; package: string; tier: string }>('/gems/purchase', { packageId });
