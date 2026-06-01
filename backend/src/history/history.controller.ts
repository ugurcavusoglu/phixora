import { Controller, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private history: HistoryService) {}

  @Get()
  getAll(@Req() req: any) {
    return this.history.getAll(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    return this.history.getOne(id, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.history.delete(id, req.user.id);
  }
}
