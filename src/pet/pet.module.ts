import { Module } from '@nestjs/common';

import { PetController } from './controllers/pet.controller';
import { PetTypeController } from './controllers/pet-type.controller';
import { PetBreedController } from './controllers/pet-breed.controller';
import { PetSizeController } from './controllers/pet-size.controller';
import { PetSexController } from './controllers/pet-sex.controller';
import { PetColorController } from './controllers/pet-color.controller';

import { PetService } from './services/pet.service';
import { PetSizeService } from './services/pet-size.service';
import { PetBreedService } from './services/pet-breed.service';
import { PetTypeService } from './services/pet-type.service';

import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [
    PetController,
    PetTypeController,
    PetBreedController,
    PetSizeController,
    PetColorController,
    PetSexController,
  ],
  providers: [PetService, PetTypeService, PetBreedService, PetSizeService],
  imports: [DatabaseModule],
})
export class PetModule {}
