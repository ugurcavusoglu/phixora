import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure upload/output directories exist
  const uploadsDir = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
  const outputsDir = join(process.cwd(), process.env.OUTPUT_DIR || 'outputs');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  // Serve uploads and outputs as static files
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });
  app.useStaticAssets(outputsDir, { prefix: '/outputs' });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT || 3000);
  console.log(`Backend running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
