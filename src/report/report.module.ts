import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { DatabaseModule } from 'src/database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { REPORT_QUEUE_NAME } from 'src/constants/queue.constants';
import { ReportProcessor } from './queue/processors/report.processor';
import { ReportMatchService } from './services/report-match.service';
import { ReportTypeController } from './controllers/report-type.controller';
import { ReportTypeService } from './services/report-type.service';

@Module({
  controllers: [ReportController, ReportTypeController],
  providers: [
    ReportService,
    ReportProcessor,
    ReportMatchService,
    ReportTypeService,
  ],
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: REPORT_QUEUE_NAME,
    }),
  ],
})
export class ReportModule {}
