import { IsString } from 'class-validator';

export class CreatePetTypeDto {
  @IsString()
  name: string;
}
