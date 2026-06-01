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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
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
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: (parseInt(process.env.MAX_UPLOAD_MB || '10')) * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  process(
    @UploadedFile() file: Express.Multer.File,
    @Body('tool') tool: Tool,
    @Body('scale') scale: string,
    @Body('intensity') intensity: string,
    @Body('faceEnhance') faceEnhance: string,
    @Req() req: any,
  ) {
    return this.image.process(req.user.id, tool, file, {
      scale: scale ? (parseInt(scale) as 2 | 4) : 4,
      intensity: (intensity as 'low' | 'medium' | 'high') || 'medium',
      faceEnhance: faceEnhance === 'true',
    });
  }
}
