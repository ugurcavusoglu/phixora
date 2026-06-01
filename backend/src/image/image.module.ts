import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [HistoryModule],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
