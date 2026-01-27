import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { ReportService } from '../services/report.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReportDto: CreateReportDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // Set the reportedById from the authenticated user
    const reportData = {
      ...createReportDto,
      reportedById: req.user.id,
    };
    return this.reportService.create(reportData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('includeResolved') includeResolved?: string,
  ) {
    const { lat, long } = req.user;
    const includeResolvedBool = includeResolved === 'true';
    return this.reportService.findAllByLatAndLong(lat, long, {
      includeResolved: includeResolvedBool,
    });
  }

  @Get('public/recent')
  findRecent() {
    return this.reportService.findRecent(10);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
