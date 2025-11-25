import { Injectable } from '@nestjs/common';
import { Report } from '../entities/report.entity';

@Injectable()
export class ReportMatchService {
  async test(report: Report) {
    for (let i = 0; i <= 100; i += 20) {
      console.log('report', report);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
