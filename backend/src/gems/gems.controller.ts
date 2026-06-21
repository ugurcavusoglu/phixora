import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GemsService } from './gems.service';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('gems')
@UseGuards(JwtAuthGuard)
export class GemsController {
  constructor(private gems: GemsService) {}

  @Post('purchase')
  purchase(@Req() req: any, @Body() dto: PurchaseDto) {
    return this.gems.purchase(req.user.id, dto.packageId);
  }
}
