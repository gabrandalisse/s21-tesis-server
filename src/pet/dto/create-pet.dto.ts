import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePetDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  typeId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  breedId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  colorId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  sizeId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  sexId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  age: number;

  @IsString()
  photoUrl: string;

  @IsString()
  distinctiveCharacteristics: string | undefined;
}
