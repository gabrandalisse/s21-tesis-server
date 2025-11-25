import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { REPORT_QUEUE_NAME } from 'src/constants/queue.constants';
import { Report } from 'src/report/entities/report.entity';
import { ReportMatchService } from 'src/report/services/report-match.service';

@Processor(REPORT_QUEUE_NAME)
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly matchService: ReportMatchService) {
    super();
  }

  async process(job: Job<{ report: Report }>): Promise<void> {
    this.logger.log(
      `Processing report job with id: ${job.id} and data: ${JSON.stringify(job.data)}`,
    );

    try {
      // TODO PONER IF DEL NAME
      const { report } = job.data;

      await this.matchService.findMatches(report);

      // TODO dsp notificar si encontro matches, poner un notificationService

      this.logger.log(`Report job with id: ${job.id} has been completed.`);
    } catch (error: unknown) {
      this.logger.error(
        `Error processing report job with id: ${job.id}: ${(error as Error).message}`,
      );

      throw error;
    }
  }
}
