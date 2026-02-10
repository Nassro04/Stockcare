import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class DispatchStockDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
