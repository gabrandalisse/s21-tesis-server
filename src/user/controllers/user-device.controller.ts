import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserDeviceService } from '../services/user-device.service';
import { CreateUserDeviceDto } from '../dto/create-user-device.dto';

@Controller('user-device')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @Post()
  create(@Body() createUserDeviceDto: CreateUserDeviceDto) {
    return this.userDeviceService.create(createUserDeviceDto);
  }

  @Get()
  findAll() {
    return this.userDeviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userDeviceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userDeviceService.remove(id);
  }
}
