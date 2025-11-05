import { IsString } from 'class-validator';

export class CreatePetBreedDto {
  @IsString()
  name: string;
}
