import { IsIn, IsOptional } from 'class-validator';

export class PurchaseDto {
  @IsIn(['starter', 'popular', 'pro'])
  packageId: 'starter' | 'popular' | 'pro';

  @IsOptional()
  @IsIn(['monthly', 'annual'])
  billing?: 'monthly' | 'annual';
}
