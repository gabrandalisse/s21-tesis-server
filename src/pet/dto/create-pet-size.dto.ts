import { IsString } from 'class-validator';

export class CreatePetSizeDto {
  @IsString()
  name: string;
}
