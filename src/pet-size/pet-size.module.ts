import { Module } from '@nestjs/common';
import { PetSizeService } from './pet-size.service';
import { PetSizeController } from './pet-size.controller';

@Module({
  controllers: [PetSizeController],
  providers: [PetSizeService],
})
export class PetSizeModule {}
