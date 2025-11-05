import { PartialType } from '@nestjs/mapped-types';
import { CreatePetBreedDto } from '../../pet/dto/create-pet-breed.dto';

export class UpdatePetBreedDto extends PartialType(CreatePetBreedDto) {}
