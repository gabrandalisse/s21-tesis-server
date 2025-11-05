import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreatePetTypeDto } from '../dto/create-pet-type.dto';
import { PetTypeService } from '../services/pet-type.service';

@Controller('pet-type')
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) {}

  @Post()
  create(@Body() createPetTypeDto: CreatePetTypeDto) {
    return this.petTypeService.create(createPetTypeDto);
  }

  @Get()
  findAll() {
    return this.petTypeService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petTypeService.remove(id);
  }
}
