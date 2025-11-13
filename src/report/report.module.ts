import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [DatabaseModule],
})
export class ReportModule {}
