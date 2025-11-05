import { Module } from '@nestjs/common';
import { PetTypeModule } from './pet-type/pet-type.module';

@Module({
  imports: [PetTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
