import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreatePetBreedDto } from '../dto/create-pet-breed.dto';
import { PetBreedService } from '../services/pet-breed.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import PetBreedMapper from '../mappers/pet-breed.mapper';

@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPetBreedDto: CreatePetBreedDto) {
    const petBreed = await this.petBreedService.create(createPetBreedDto);
    return PetBreedMapper.toJSON(petBreed);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const petBreeds = await this.petBreedService.findAll();
    return PetBreedMapper.toJSONArray(petBreeds);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petBreedService.remove(id);
  }
}
