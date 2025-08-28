import { IsNotEmpty, IsInt, IsPositive, IsString, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseItemDto {
  @IsString()
  @IsNotEmpty()
  productLotNumber!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class CreatePurchaseDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];
}

