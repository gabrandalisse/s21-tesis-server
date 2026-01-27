import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { REPORT_QUEUE_NAME } from 'src/constants/queue.constants';
import { Report } from 'src/report/entities/report.entity';
import { ReportMatchService } from 'src/report/services/report-match.service';
import { ReportService } from 'src/report/services/report.service';
import { NotificationService } from 'src/notification/services/notification.service';

@Processor(REPORT_QUEUE_NAME)
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(
    private readonly matchService: ReportMatchService,
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<{ report: Report }>): Promise<void> {
    this.logger.log(
      `Processing report job with id: ${job.id} and data: ${JSON.stringify(job.data)}`,
    );

    try {
      const { report: reportPlain } = job.data;

      // Get the report ID from the plain object
      const reportId = (reportPlain as any).id;

      if (!reportId) {
        throw new Error('Report ID not found in job data');
      }

      // Fetch the full report with all relations from the database
      const report = await this.reportService.findOne(reportId);

      const matches = await this.matchService.findMatches(report);

      if (!matches || matches.length === 0) {
        this.logger.log(`no matches found for report id ${reportId}`);
        return;
      }

      this.logger.log(
        `${matches.length} matches found for report id ${reportId}`,
      );

      // Notify user about matches
      await this.sendMatchNotifications(report, matches.length);

      this.logger.log(`Report job with id: ${job.id} has been completed.`);
    } catch (error: unknown) {
      this.logger.error(
        `Error processing report job with id: ${job.id}: ${(error as Error).message}`,
      );

      throw error;
    }
  }

  private async sendMatchNotifications(report: Report, matchCount: number): Promise<void> {
    try {
      const petType = report.getPet().getType();
      const petBreed = report.getPet().getBreed();
      const ownerId = report.getReportedBy().getId();

      await this.notificationService.sendToUser(ownerId, {
        title: '¡Posibles coincidencias encontradas!',
        body: `Encontramos ${matchCount} ${matchCount === 1 ? 'coincidencia' : 'coincidencias'} para tu ${petType} ${petBreed} perdido`,
        data: {
          reportId: report.getId(),
          type: 'matches_found',
          matchCount,
          url: `/report/${report.getId()}`,
        },
        tag: `matches-${report.getId()}`,
        requireInteraction: true,
      });

      this.logger.log(`Sent match notification to user ${ownerId} for report ${report.getId()}`);
    } catch (error) {
      this.logger.error(`Failed to send match notifications:`, error);
    }
  }
}
