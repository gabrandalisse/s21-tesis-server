import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetBreedService } from './pet-breed.service';
import { CreatePetBreedDto } from './dto/create-pet-breed.dto';
import { UpdatePetBreedDto } from './dto/update-pet-breed.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petBreedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetBreedDto: UpdatePetBreedDto) {
    return this.petBreedService.update(+id, updatePetBreedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petBreedService.remove(+id);
  }
}
