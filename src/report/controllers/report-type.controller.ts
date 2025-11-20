import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportTypeService } from '../services/report-type.service';
import { CreateReportTypeDto } from '../dto/create-report-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('report-type')
export class ReportTypeController {
  constructor(private readonly reportTypeService: ReportTypeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReportTypeDto: CreateReportTypeDto) {
    return this.reportTypeService.create(createReportTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reportTypeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportTypeService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportTypeService.remove(+id);
  }
}
