import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

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

  @IsString()
  photourl: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  reportedById: number;
}
