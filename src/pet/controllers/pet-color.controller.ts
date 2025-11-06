import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PetColorService } from '../services/pet-color.service';
import { CreatePetColorDto } from '../dto/create-pet-color.dto';

@Controller('pet-color')
export class PetColorController {
  constructor(private readonly petColorService: PetColorService) {}

  @Post()
  create(@Body() createPetColorDto: CreatePetColorDto) {
    return this.petColorService.create(createPetColorDto);
  }

  @Get()
  findAll() {
    return this.petColorService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petColorService.remove(id);
  }
}
