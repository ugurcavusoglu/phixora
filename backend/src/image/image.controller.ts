import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import type { Tool } from './image.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('image')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private image: ImageService) {}

  @Post('process')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  process(
    @UploadedFile() file: Express.Multer.File,
    @Body('tool') tool: Tool,
    @Req() req: any,
  ) {
    return this.image.process(req.user.id, tool, file);
  }
}
