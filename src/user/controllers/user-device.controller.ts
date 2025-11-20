import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserDeviceService } from '../services/user-device.service';
import { CreateUserDeviceDto } from '../dto/create-user-device.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user-device')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDeviceDto: CreateUserDeviceDto) {
    return this.userDeviceService.create(createUserDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userDeviceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userDeviceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userDeviceService.remove(id);
  }
}
