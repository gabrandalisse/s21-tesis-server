import { IsString } from 'class-validator';

export class CreatePetColorDto {
  @IsString()
  name: string;
}
