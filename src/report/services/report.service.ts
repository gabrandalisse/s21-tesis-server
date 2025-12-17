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

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectQueue(REPORT_QUEUE_NAME) private readonly reportQueue: Queue,
    private readonly dbService: DatabaseService,
  ) {}

  public async create(createReportDto: CreateReportDto) {
    const result = await this.dbService.report.create({
      data: createReportDto,
      include: REPORT_BASE_RELATIONS,
    });

    const report = ReportMapper.toDomain(result);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (report.getType().toLowerCase() === ReportTypeEnum.LOST)
      await this.reportQueue.add(REPORT_CREATED_JOB_NAME, { report });

    // TODO add a queue for notifications? -> Yes!

    return report;
  }

  public async findAllByLatAndLong(
    lat: number,
    long: number,
    options?: object,
  ) {
    this.logger.log(`Finding reports near lat: ${lat}, long: ${long}`);

    const dbResult = await this.dbService.report.findMany({
      include: REPORT_BASE_RELATIONS,
      where: { resolved: false, ...options },
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

      return distanceKm <= REPORT_MAX_DISTANCE_KM;
    });

    this.logger.log(
      `Filtered to ${filteredReports.length} reports within ${REPORT_MAX_DISTANCE_KM} km`,
    );

    return filteredReports;
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
}
