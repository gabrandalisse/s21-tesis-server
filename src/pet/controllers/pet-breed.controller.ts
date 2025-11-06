import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreatePetBreedDto } from '../dto/create-pet-breed.dto';
import { PetBreedService } from '../services/pet-breed.service';

@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) {}

  @Post()
  create(@Body() createPetBreedDto: CreatePetBreedDto) {
    return this.petBreedService.create(createPetBreedDto);
  }

  @Get()
  findAll() {
    return this.petBreedService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petBreedService.remove(id);
  }
}
