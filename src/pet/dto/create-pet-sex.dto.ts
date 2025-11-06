import { IsString } from 'class-validator';

export class CreatePetSexDto {
  @IsString()
  name: string;
}
