import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { DatabaseService } from 'src/database/database.service';
import ReportMapper from '../mappers/report.mapper';
import { REPORT_FULL_RELATIONS } from 'src/constants/includes.constants';
import DistanceUtils from 'src/utils/distance.utils';
import { REPORT_MAX_DISTANCE_KM } from 'src/constants/distance.constants';

@Injectable()
export class ReportService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createReportDto: CreateReportDto) {
    const report = await this.dbService.report.create({
      data: createReportDto,
      include: REPORT_FULL_RELATIONS,
    });

    return ReportMapper.toDomain(report);
  }

  public async findAll(userLat: number, userLong: number) {
    const dbResult = await this.dbService.report.findMany({
      include: REPORT_FULL_RELATIONS,
    });

    const reports = ReportMapper.toDomainArray(dbResult);

    return reports.filter((report) => {
      const distanceKm = DistanceUtils.haversineDistance(
        userLat,
        userLong,
        report.lat,
        report.long,
      );

      return distanceKm <= REPORT_MAX_DISTANCE_KM;
    });
  }

  public async findOne(id: number) {
    const report = await this.dbService.report.findUnique({
      where: { id },
      include: REPORT_FULL_RELATIONS,
    });

    if (!report) return null;
    else return ReportMapper.toDomain(report);
  }

  public async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.dbService.report.update({
      where: { id },
      data: updateReportDto,
      include: REPORT_FULL_RELATIONS,
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
