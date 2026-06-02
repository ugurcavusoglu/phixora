import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HistoryService } from '../history/history.service';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import Replicate from 'replicate';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export interface ProcessOptions {
  scale?: 2 | 4;
  intensity?: 'low' | 'medium' | 'high';
  faceEnhance?: boolean;
}

// Replicate model versions (owner/model:version). Pinned for reproducibility.
const MODELS = {
  upscale:
    'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
  removeBg:
    'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
} as const;

@Injectable()
export class ImageService {
  private replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  constructor(private history: HistoryService) {}

  async process(
    userId: string,
    tool: Tool,
    file: Express.Multer.File,
    options: ProcessOptions = {},
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new InternalServerErrorException('REPLICATE_API_TOKEN is not set');
    }

    const outputDir = join(process.cwd(), process.env.OUTPUT_DIR || 'outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputExt =
      tool === 'remove-background' ? '.png' : extname(file.originalname) || '.png';
    const outputFilename = `${randomUUID()}${outputExt}`;
    const outputPath = join(outputDir, outputFilename);

    const inputUrl = `/uploads/${file.filename}`;
    const outputUrl = `/outputs/${outputFilename}`;

    const resultUrl = await this.runReplicate(tool, file.path, options);
    await this.downloadTo(resultUrl, outputPath);

    const record = await this.history.create(userId, tool, inputUrl, outputUrl);
    return { historyId: record.id, outputUrl };
  }

  /** Runs the matching Replicate model and returns the output image URL. */
  private async runReplicate(
    tool: Tool,
    inputPath: string,
    options: ProcessOptions,
  ): Promise<string> {
    const imageData = fs.readFileSync(inputPath);

    let model: string;
    let input: Record<string, unknown>;

    if (tool === 'remove-background') {
      model = MODELS.removeBg;
      input = { image: imageData };
    } else {
      // super-resolution and remove-noise both use Real-ESRGAN.
      // remove-noise = upscale at scale 1 (denoise without enlarging).
      model = MODELS.upscale;
      input = {
        image: imageData,
        scale: tool === 'remove-noise' ? 1 : options.scale ?? 4,
        face_enhance: tool === 'super-resolution' ? !!options.faceEnhance : false,
      };
    }

    let output: unknown;
    try {
      output = await this.replicate.run(model as `${string}/${string}`, { input });
    } catch (err) {
      throw new InternalServerErrorException(
        `AI provider error: ${(err as Error).message}`,
      );
    }

    const url = this.extractUrl(output);
    if (!url) {
      throw new InternalServerErrorException('AI provider returned no image');
    }
    return url;
  }

  /** Replicate outputs vary: a URL string, an array, or a FileOutput with .url(). */
  private extractUrl(output: unknown): string | null {
    if (typeof output === 'string') return output;
    if (Array.isArray(output)) return this.extractUrl(output[0]);
    if (output && typeof (output as any).url === 'function') {
      return (output as any).url().toString();
    }
    if (output && typeof (output as any).url === 'string') {
      return (output as any).url;
    }
    return null;
  }

  private async downloadTo(url: string, destPath: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new InternalServerErrorException(
        `Failed to download result (${res.status})`,
      );
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
  }
}
