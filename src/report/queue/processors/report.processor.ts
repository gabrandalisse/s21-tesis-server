import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { REPORT_QUEUE_NAME } from 'src/constants/queue.constants';
import { Report } from 'src/report/entities/report.entity';
import { ReportMatchService } from 'src/report/services/report-match.service';
import { ReportService } from 'src/report/services/report.service';

@Processor(REPORT_QUEUE_NAME)
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(
    private readonly matchService: ReportMatchService,
    private readonly reportService: ReportService,
  ) {
    super();
  }

  async process(job: Job<{ report: Report }>): Promise<void> {
    this.logger.log(
      `Processing report job with id: ${job.id} and data: ${JSON.stringify(job.data)}`,
    );

    try {
      const { report } = job.data;

      const matches = await this.matchService.findMatches(report);

      if (!matches || matches.length === 0) {
        this.logger.log(`no matches found for report id ${report.getId()}`);
        return;
      }

      this.logger.log(
        `${matches.length} matches found for report id ${report.getId()}`,
      );

      const foundReportId = matches.map((m) => ({ id: m.id }));
      await this.reportService.update(report.getId(), {
        foundMatches: {
          connect: foundReportId,
        },
      });

      this.logger.log(
        `report id ${report.getId()} updated with matches ${JSON.stringify(foundReportId)}`,
      );

      // TODO notify user

      this.logger.log(`Report job with id: ${job.id} has been completed.`);
    } catch (error: unknown) {
      this.logger.error(
        `Error processing report job with id: ${job.id}: ${(error as Error).message}`,
      );

      throw error;
    }
  }
}
