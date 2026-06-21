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

  async purchase(userId: string, packageId: keyof typeof PACKAGES) {
    const pkg = PACKAGES[packageId];
    if (!pkg) throw new BadRequestException('Invalid package');

    const current = await this.prisma.user.findUnique({ where: { id: userId }, select: { tier: true } });
    const newTier = (TIER_RANK[pkg.tier] ?? 0) > (TIER_RANK[current?.tier ?? 'free'] ?? 0) ? pkg.tier : current?.tier ?? 'free';

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { gems: { increment: pkg.gems }, tier: newTier },
      select: { gems: true, tier: true },
    });

    return { gems: user.gems, added: pkg.gems, package: packageId, tier: user.tier };
  }
}
