import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportMatchService } from '../services/report-match.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('report-match')
export class ReportMatchController {
  constructor(private readonly reportMatchService: ReportMatchService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findAllByLostReportId(@Param('id') id: string) {
    return this.reportMatchService.findAllMatchesByLostReportId(+id);
  }
}
