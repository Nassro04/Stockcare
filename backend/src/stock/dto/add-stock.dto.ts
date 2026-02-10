import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AddStockDto {
  @IsInt()
  productId: number;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  expirationDate: string;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
