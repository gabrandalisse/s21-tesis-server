import { Module } from '@nestjs/common';
import { PetTypeModule } from './pet-type/pet-type.module';
import { PetBreedModule } from './pet-breed/pet-breed.module';
import { PetSizeModule } from './pet-size/pet-size.module';

@Module({
  imports: [PetTypeModule, PetBreedModule, PetSizeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
