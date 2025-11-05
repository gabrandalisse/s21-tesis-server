import { Module } from '@nestjs/common';
import { PetBreedService } from './pet-breed.service';
import { PetBreedController } from './pet-breed.controller';

@Module({
  controllers: [PetBreedController],
  providers: [PetBreedService],
})
export class PetBreedModule {}
