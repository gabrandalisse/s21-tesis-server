import { PartialType } from '@nestjs/mapped-types';
import { CreatePetTypeDto } from '../../pet/dto/create-pet-type.dto';

export class UpdatePetTypeDto extends PartialType(CreatePetTypeDto) {}
