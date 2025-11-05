import { Module } from '@nestjs/common';
import { PetTypeModule } from './pet-type/pet-type.module';
import { PetBreedModule } from './pet-breed/pet-breed.module';

@Module({
  imports: [PetTypeModule, PetBreedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
