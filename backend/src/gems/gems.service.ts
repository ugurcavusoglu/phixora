import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const PACKAGES = {
  starter: { gems: 50, price: 1.99, tier: 'starter' },
  popular: { gems: 150, price: 4.99, tier: 'popular' },
  pro: { gems: 500, price: 9.99, tier: 'pro' },
} as const;

const TIER_RANK = { free: 0, starter: 1, popular: 2, pro: 3 } as Record<string, number>;

@Injectable()
export class GemsService {
  constructor(private prisma: PrismaService) {}

  async purchase(userId: string, packageId: keyof typeof PACKAGES, billing: 'monthly' | 'annual' = 'monthly') {
    const pkg = PACKAGES[packageId];
    if (!pkg) throw new BadRequestException('Invalid package');

    const current = await this.prisma.user.findUnique({ where: { id: userId }, select: { tier: true, billing: true } });
    const currentTier = current?.tier ?? 'free';
    const currentBilling = current?.billing ?? 'none';

    if (currentBilling === 'annual' && billing === 'monthly') {
      throw new BadRequestException('Cannot switch from annual to monthly billing');
    }

    const newTier = (TIER_RANK[pkg.tier] ?? 0) > (TIER_RANK[currentTier] ?? 0) ? pkg.tier : currentTier;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { gems: { increment: pkg.gems }, tier: newTier, billing },
      select: { gems: true, tier: true, billing: true },
    });

    return { gems: user.gems, added: pkg.gems, package: packageId, tier: user.tier, billing: user.billing };
  }
}
