import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetTypeService } from './pet-type.service';
import { CreatePetTypeDto } from './dto/create-pet-type.dto';
import { UpdatePetTypeDto } from './dto/update-pet-type.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetTypeDto: UpdatePetTypeDto) {
    return this.petTypeService.update(+id, updatePetTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petTypeService.remove(+id);
  }
}
