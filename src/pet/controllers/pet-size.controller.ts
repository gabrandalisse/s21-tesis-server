import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreatePetSizeDto } from '../dto/create-pet-size.dto';
import { PetSizeService } from '../services/pet-size.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('pet-size')
export class PetSizeController {
  constructor(private readonly petSizeService: PetSizeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetSizeDto: CreatePetSizeDto) {
    return this.petSizeService.create(createPetSizeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.petSizeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petSizeService.remove(id);
  }
}
