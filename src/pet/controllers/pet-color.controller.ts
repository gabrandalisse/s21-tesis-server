import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PetColorService } from '../services/pet-color.service';
import { CreatePetColorDto } from '../dto/create-pet-color.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('pet-color')
export class PetColorController {
  constructor(private readonly petColorService: PetColorService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetColorDto: CreatePetColorDto) {
    return this.petColorService.create(createPetColorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.petColorService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petColorService.remove(id);
  }
}
