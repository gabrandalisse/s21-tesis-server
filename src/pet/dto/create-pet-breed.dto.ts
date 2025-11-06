import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreatePetBreedDto {
  @IsString()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  typeId: number;
}
