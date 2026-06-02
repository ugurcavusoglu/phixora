import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
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
  // SwinIR — sharper textures than Real-ESRGAN for real-world super-resolution.
  upscale:
    'jingyunliang/swinir:660d922d33153019e8c263a3bba265de882e7f4f70396546b6c9c8f9d47a021a',
  // NAFNet — a real denoiser (not an upscaler hack) for noise removal.
  denoise:
    'megvii-research/nafnet:018241a6c880319404eaa2714b764313e27e11f950a7ff0a7b5b37b27b74dcf7',
  // 851-labs background-remover — cleaner edges than the old rembg.
  removeBg:
    '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc',
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
    _options: ProcessOptions,
  ): Promise<string> {
    const imageData = fs.readFileSync(inputPath);

    let model: string;
    let input: Record<string, unknown>;

    if (tool === 'remove-background') {
      model = MODELS.removeBg;
      input = { image: imageData, format: 'png', background_type: 'rgba' };
    } else if (tool === 'remove-noise') {
      model = MODELS.denoise;
      input = { image: imageData, task_type: 'Image Denoising' };
    } else {
      // super-resolution
      model = MODELS.upscale;
      input = { image: imageData, task_type: 'Real-World Image Super-Resolution-Large' };
    }

    let output: unknown;
    try {
      output = await this.replicate.run(model as `${string}/${string}`, { input });
    } catch (err) {
      console.error(`[AI] ${tool} failed:`, err);
      const status = (err as any)?.response?.status;
      if (status === 429) {
        throw new HttpException(
          'The AI service is busy right now. Please wait a moment and try again.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
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
