import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  petId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  reportTypeId: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Transform(({ value }) => parseFloat(value))
  long: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  reportedById?: number;
}
