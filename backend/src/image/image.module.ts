import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { HistoryModule } from '../history/history.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HistoryModule, PrismaModule],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
