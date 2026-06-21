import api from './client';

export type PackageId = 'starter' | 'popular' | 'pro';
export type Billing = 'monthly' | 'annual';

export const purchaseGems = (packageId: PackageId, billing: Billing = 'monthly') =>
  api.post<{ gems: number; added: number; package: string; tier: string; billing: string }>('/gems/purchase', { packageId, billing });
