import { PartialType } from '@nestjs/mapped-types';
import { CreatePetSizeDto } from './create-pet-size.dto';

export class UpdatePetSizeDto extends PartialType(CreatePetSizeDto) {}
