import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PetService } from '../services/pet.service';
import { CreatePetDto } from '../dto/create-pet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetDto: CreatePetDto, @Request() req: AuthenticatedRequest) {
    // Ensure userId is set from the authenticated user
    const petData = { 
      ...createPetDto, 
      userId: req.user.id 
    };
    return this.petService.create(petData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.petService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.petService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.petService.remove(id);
  }
}
