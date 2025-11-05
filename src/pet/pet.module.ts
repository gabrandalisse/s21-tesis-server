import { Module } from '@nestjs/common';

import { PetController } from './controllers/pet.controller';
import { PetTypeController } from './controllers/pet-type.controller';
import { PetBreedController } from './controllers/pet-breed.controller';
import { PetSizeController } from './controllers/pet-size.controller';

import { PetService } from './services/pet.service';
import { PetSizeService } from './services/pet-size.service';
import { PetBreedService } from './services/pet-breed.service';
import { PetTypeService } from './services/pet-type.service';

@Module({
  controllers: [
    PetController,
    PetTypeController,
    PetBreedController,
    PetSizeController,
  ],
  providers: [PetService, PetTypeService, PetBreedService, PetSizeService],
})
export class PetModule {}
