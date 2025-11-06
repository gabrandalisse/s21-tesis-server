import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PetService } from '../services/pet.service';
import { CreatePetDto } from '../dto/create-pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  findAll() {
    return this.petService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.petService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petService.remove(id);
  }
}
