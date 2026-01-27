import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { DatabaseService } from 'src/database/database.service';
import ReportMapper from '../mappers/report.mapper';
import { REPORT_BASE_RELATIONS } from 'src/constants/includes.constants';
import DistanceUtils from 'src/utils/distance.utils';
import { REPORT_MAX_DISTANCE_KM } from 'src/constants/distance.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  REPORT_CREATED_JOB_NAME,
  REPORT_QUEUE_NAME,
} from 'src/constants/queue.constants';
import { ReportTypeEnum } from 'src/enums/report.enums';
import { Report } from '../entities/report.entity';
import { GeocodingUtils } from 'src/utils/geocoding.utils';
import { NotificationService } from 'src/notification/services/notification.service';

type CreateReportData = CreateReportDto & { reportedById: number };

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectQueue(REPORT_QUEUE_NAME) private readonly reportQueue: Queue,
    private readonly dbService: DatabaseService,
    private readonly notificationService: NotificationService,
  ) {}

  public async create(createReportDto: CreateReportData) {
    this.logger.log(
      `Creating report with values: ${JSON.stringify(createReportDto)}`,
    );

    // Geocode the address from coordinates
    const address = await GeocodingUtils.reverseGeocode(
      createReportDto.lat,
      createReportDto.long,
    );

    const result = await this.dbService.report.create({
      data: {
        ...createReportDto,
        address,
      },
      include: REPORT_BASE_RELATIONS,
    });

    const report = ReportMapper.toDomain(result);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (report.getType() === ReportTypeEnum.LOST)
      await this.reportQueue.add(REPORT_CREATED_JOB_NAME, { report });

    // Send push notifications to nearby users
    this.sendReportCreatedNotifications(report).catch((error) =>
      this.logger.error('Failed to send report notifications:', error),
    );

    return report;
  }

  public async findAllByLatAndLong(
    lat: number,
    long: number,
    options?: { includeResolved?: boolean },
  ) {
    this.logger.log(`Finding reports near lat: ${lat}, long: ${long}`);

    // Build the where clause properly
    const whereClause: any = {};

    // By default, exclude resolved reports unless explicitly requested
    if (options?.includeResolved !== true) {
      whereClause.resolved = false;
    }

    const dbResult = await this.dbService.report.findMany({
      include: REPORT_BASE_RELATIONS,
      where: whereClause,
      orderBy: { reportedAt: 'desc' },
      take: 100, // Limit to 100 most recent reports for performance
    });

    this.logger.log(`Found ${dbResult.length} reports in DB`);

    const reports = ReportMapper.toDomainArray(dbResult);

    const filteredReports = reports.filter((report) => {
      const distanceKm = DistanceUtils.haversineDistance(
        lat,
        long,
        report.getLat(),
        report.getLong(),
      );

      // Set distance on the report
      report.setDistanceKm(distanceKm);

      return distanceKm <= REPORT_MAX_DISTANCE_KM;
    });

    this.logger.log(
      `Filtered to ${filteredReports.length} reports within ${REPORT_MAX_DISTANCE_KM} km`,
    );

    // Geocode addresses for reports that don't have one
    const reportsNeedingGeocode = filteredReports.filter(
      (report) => !report.getAddress(),
    );

    if (reportsNeedingGeocode.length > 0) {
      this.logger.log(
        `Geocoding ${reportsNeedingGeocode.length} reports without addresses`,
      );

      // Update reports with addresses in the background (don't await)
      this.geocodeReportsInBackground(reportsNeedingGeocode).catch((error) =>
        this.logger.error(`Error geocoding reports: ${error.message}`),
      );
    }

    return filteredReports;
  }

  private async geocodeReportsInBackground(reports: Report[]): Promise<void> {
    for (const report of reports) {
      try {
        const address = await GeocodingUtils.reverseGeocode(
          report.getLat(),
          report.getLong(),
        );

        await this.dbService.report.update({
          where: { id: report.getId() },
          data: { address },
        });

        this.logger.log(`Updated address for report ${report.getId()}`);
      } catch (error) {
        this.logger.error(
          `Failed to geocode report ${report.getId()}: ${error.message}`,
        );
      }

      // Add delay to respect Nominatim usage policy
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  public async findOne(id: number): Promise<Report> {
    const report = await this.dbService.report.findUnique({
      where: { id },
      include: REPORT_BASE_RELATIONS,
    });

    if (!report) throw new NotFoundException(`no report found for id ${id}`);
    return ReportMapper.toDomain(report);
  }

  public async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.dbService.report.update({
      where: { id },
      data: updateReportDto,
      include: REPORT_BASE_RELATIONS,
    });

    return ReportMapper.toDomain(report);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.report.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }

  public async findRecent(limit: number = 10): Promise<Report[]> {
    this.logger.log(`Finding ${limit} most recent reports`);

    const dbResult = await this.dbService.report.findMany({
      include: REPORT_BASE_RELATIONS,
      where: { resolved: false },
      orderBy: { reportedAt: 'desc' },
      take: limit,
    });

    this.logger.log(`Found ${dbResult.length} recent reports`);

    return ReportMapper.toDomainArray(dbResult);
  }

  private async sendReportCreatedNotifications(report: Report): Promise<void> {
    try {
      const reportType = report.getType() === ReportTypeEnum.LOST ? 'perdida' : 'encontrada';
      const petType = report.getPet().getType();
      const petBreed = report.getPet().getBreed();

      await this.notificationService.sendToUsersInRadius(
        report.getLat(),
        report.getLong(),
        REPORT_MAX_DISTANCE_KM,
        {
          title: `Nueva mascota ${reportType} cerca de ti`,
          body: `Se reportó un ${petType} ${petBreed} ${reportType} en tu área`,
          data: {
            reportId: report.getId(),
            type: 'report_created',
            url: `/report/${report.getId()}`,
          },
          tag: `report-${report.getId()}`,
        },
        report.getReportedBy().getId(), // Exclude the report creator
      );

      this.logger.log(`Sent notifications for report ${report.getId()}`);
    } catch (error) {
      this.logger.error(`Failed to send notifications for report ${report.getId()}:`, error);
    }
  }
}
