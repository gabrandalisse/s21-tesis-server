import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePetTypeDto } from '../dto/create-pet-type.dto';
import { PetTypeService } from '../services/pet-type.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('pet-type')
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetTypeDto: CreatePetTypeDto) {
    return this.petTypeService.create(createPetTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('withBreeds') withBreeds: string) {
    return this.petTypeService.findAll(withBreeds === 'true');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petTypeService.remove(id);
  }
}
