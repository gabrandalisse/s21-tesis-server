import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreatePetSizeDto } from '../dto/create-pet-size.dto';
import { PetSizeService } from '../services/pet-size.service';

@Controller('pet-size')
export class PetSizeController {
  constructor(private readonly petSizeService: PetSizeService) {}

  @Post()
  create(@Body() createPetSizeDto: CreatePetSizeDto) {
    return this.petSizeService.create(createPetSizeDto);
  }

  @Get()
  findAll() {
    return this.petSizeService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petSizeService.remove(id);
  }
}
