import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PetSexService } from '../services/pet-sex.service';
import { CreatePetSexDto } from '../dto/create-pet-sex.dto';

@Controller('pet-sex')
export class PetSexController {
  constructor(private readonly petSexService: PetSexService) {}

  @Post()
  create(@Body() createPetSexDto: CreatePetSexDto) {
    return this.petSexService.create(createPetSexDto);
  }

  @Get()
  findAll() {
    return this.petSexService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petSexService.remove(id);
  }
}
