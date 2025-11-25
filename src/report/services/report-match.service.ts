import { Injectable } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { ReportService } from './report.service';
import { ReportTypeEnum } from 'src/enums/report.enums';
import { ReportMatch } from '../entities/report-match.entity';

@Injectable()
export class ReportMatchService {
  constructor(private readonly reportService: ReportService) {}

  async findMatches(lostReport: Report) {
    const foundReports = await this.reportService.findAllByLatAndLong(
      lostReport.lat,
      lostReport.long,
      { reportType: { name: ReportTypeEnum.FOUND } },
    );

    return foundReports.map((report) => {
      return new ReportMatch(
        1,
        lostReport,
        report,
        Math.random(), // Simulated match score
        Math.random(),
        'pending',
        new Date(),
      );
    });
  }
}
