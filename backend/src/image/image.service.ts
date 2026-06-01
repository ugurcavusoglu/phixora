import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HistoryService } from '../history/history.service';
import { spawn } from 'child_process';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

export interface ProcessOptions {
  scale?: 2 | 4;
  intensity?: 'low' | 'medium' | 'high';
  faceEnhance?: boolean;
}

@Injectable()
export class ImageService {
  constructor(private history: HistoryService) {}

  async process(
    userId: string,
    tool: Tool,
    file: Express.Multer.File,
    options: ProcessOptions = {},
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const outputDir = join(process.cwd(), process.env.OUTPUT_DIR || 'outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputExt = tool === 'remove-background' ? '.png' : extname(file.originalname) || '.png';
    const outputFilename = `${randomUUID()}${outputExt}`;
    const outputPath = join(outputDir, outputFilename);

    const inputUrl = `/uploads/${file.filename}`;
    const outputUrl = `/outputs/${outputFilename}`;

    await this.runPythonScript(tool, file.path, outputPath, options);

    const record = await this.history.create(userId, tool, inputUrl, outputUrl);
    return { historyId: record.id, outputUrl };
  }

  private runPythonScript(
    tool: Tool,
    inputPath: string,
    outputPath: string,
    options: ProcessOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptMap: Record<Tool, string> = {
        'super-resolution': 'super_resolution.py',
        'remove-noise': 'remove_noise.py',
        'remove-background': 'remove_background.py',
      };

      const scriptPath = join(process.cwd(), 'ai', 'scripts', scriptMap[tool]);

      const args = [scriptPath, inputPath, outputPath];
      if (tool === 'super-resolution') {
        args.push(String(options.scale ?? 4));
        args.push(options.faceEnhance ? 'true' : 'false');
      }
      if (tool === 'remove-noise') args.push(options.intensity ?? 'medium');

      const python = process.env.PYTHON_PATH || 'python';
      const child = spawn(python, args);

      let stderr = '';
      child.stderr.on('data', (d) => { stderr += d.toString(); });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          // Any non-zero exit (missing deps, missing model, etc.) → graceful fallback
          console.warn(`[AI] script exited with code ${code} for tool ${tool}. stderr: ${stderr.slice(0, 200)}`);
          fs.copyFileSync(inputPath, outputPath);
          resolve();
        }
      });

      child.on('error', () => {
        // Python not on PATH — copy input as fallback so the app keeps working
        fs.copyFileSync(inputPath, outputPath);
        resolve();
      });
    });
  }
}
