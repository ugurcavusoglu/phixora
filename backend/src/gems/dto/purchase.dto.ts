import { IsIn } from 'class-validator';

export class PurchaseDto {
  @IsIn(['starter', 'popular', 'pro'])
  packageId: 'starter' | 'popular' | 'pro';
}
