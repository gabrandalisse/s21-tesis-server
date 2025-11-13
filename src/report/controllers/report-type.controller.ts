import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReportTypeService } from '../services/report-type.service';
import { CreateReportTypeDto } from '../dto/create-report-type.dto';

@Controller('report-type')
export class ReportTypeController {
  constructor(private readonly reportTypeService: ReportTypeService) {}

  @Post()
  create(@Body() createReportTypeDto: CreateReportTypeDto) {
    return this.reportTypeService.create(createReportTypeDto);
  }

  @Get()
  findAll() {
    return this.reportTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportTypeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportTypeService.remove(+id);
  }
}
