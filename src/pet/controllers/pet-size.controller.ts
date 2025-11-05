import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreatePetSizeDto } from '../dto/create-pet-size.dto';
import { UpdatePetSizeDto } from '../dto/update-pet-size.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petSizeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetSizeDto: UpdatePetSizeDto) {
    return this.petSizeService.update(+id, updatePetSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petSizeService.remove(+id);
  }
}
