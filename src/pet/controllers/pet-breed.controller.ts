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

@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetBreedDto: CreatePetBreedDto) {
    return this.petBreedService.create(createPetBreedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.petBreedService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petBreedService.remove(id);
  }
}
