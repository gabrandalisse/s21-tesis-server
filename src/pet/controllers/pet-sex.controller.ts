import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PetSexService } from '../services/pet-sex.service';
import { CreatePetSexDto } from '../dto/create-pet-sex.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('pet-sex')
export class PetSexController {
  constructor(private readonly petSexService: PetSexService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetSexDto: CreatePetSexDto) {
    return this.petSexService.create(createPetSexDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.petSexService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petSexService.remove(id);
  }
}
