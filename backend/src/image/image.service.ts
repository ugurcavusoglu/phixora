import { Injectable, BadRequestException } from '@nestjs/common';
import { HistoryService } from '../history/history.service';

export type Tool = 'super-resolution' | 'remove-noise' | 'remove-background';

@Injectable()
export class ImageService {
  constructor(private history: HistoryService) {}

  async process(
    userId: string,
    tool: Tool,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    // AI API call goes here — stub returns the same image URL for now
    const inputUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const outputUrl = inputUrl; // stub: replace with real API call

    const record = await this.history.create(userId, tool, inputUrl, outputUrl);
    return { historyId: record.id, outputUrl };
  }
}
