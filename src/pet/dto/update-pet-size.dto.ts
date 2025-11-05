import { PartialType } from '@nestjs/mapped-types';
import { CreatePetSizeDto } from '../../pet/dto/create-pet-size.dto';

export class UpdatePetSizeDto extends PartialType(CreatePetSizeDto) {}
