import { IsNotEmpty, IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  lotNumber!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantityAvailable!: number;

  @IsDateString()
  @IsNotEmpty()
  entryDate!: string;
}