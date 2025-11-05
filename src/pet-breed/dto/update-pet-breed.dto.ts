import { PartialType } from '@nestjs/mapped-types';
import { CreatePetBreedDto } from './create-pet-breed.dto';

export class UpdatePetBreedDto extends PartialType(CreatePetBreedDto) {}
