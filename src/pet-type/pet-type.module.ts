import { Module } from '@nestjs/common';
import { PetTypeService } from './pet-type.service';
import { PetTypeController } from './pet-type.controller';

@Module({
  controllers: [PetTypeController],
  providers: [PetTypeService],
})
export class PetTypeModule {}
