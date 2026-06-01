import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.history.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  getOne(id: string, userId: string) {
    return this.prisma.history.findFirst({ where: { id, userId } });
  }

  create(userId: string, tool: string, inputUrl: string, outputUrl: string) {
    return this.prisma.history.create({
      data: { userId, tool, inputUrl, outputUrl },
    });
  }

  delete(id: string, userId: string) {
    return this.prisma.history.deleteMany({ where: { id, userId } });
  }
}
