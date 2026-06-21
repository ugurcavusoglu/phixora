import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const PACKAGES = {
  starter: { gems: 50, price: 1.99 },
  popular: { gems: 150, price: 4.99 },
  pro: { gems: 500, price: 9.99 },
} as const;

@Injectable()
export class GemsService {
  constructor(private prisma: PrismaService) {}

  async purchase(userId: string, packageId: keyof typeof PACKAGES) {
    const pkg = PACKAGES[packageId];
    if (!pkg) throw new BadRequestException('Invalid package');

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { gems: { increment: pkg.gems } },
      select: { gems: true },
    });

    return { gems: user.gems, added: pkg.gems, package: packageId };
  }
}
