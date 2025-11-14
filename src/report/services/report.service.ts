import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { DatabaseService } from 'src/database/database.service';
import ReportMapper from '../mappers/report.mapper';

@Injectable()
export class ReportService {
  private readonly include = {
    pet: {
      include: {
        type: true,
        breed: true,
        size: true,
        color: true,
        sex: true,
        user: {
          include: {
            devices: true,
          },
        },
      },
    },
    reportType: true,
    reportedBy: {
      include: {
        devices: true,
      },
    },
  };

  constructor(private readonly dbService: DatabaseService) {}

  public async create(createReportDto: CreateReportDto) {
    const report = await this.dbService.report.create({
      data: createReportDto,
      include: this.include,
    });

    return ReportMapper.toDomain(report);
  }

  public async findAll() {
    const reports = await this.dbService.report.findMany({
      include: this.include,
    });

    return ReportMapper.toDomainArray(reports);
  }

  public async findOne(id: number) {
    const report = await this.dbService.report.findUnique({
      where: { id },
      include: this.include,
    });

    if (!report) return null;
    else return ReportMapper.toDomain(report);
  }

  public async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.dbService.report.update({
      where: { id },
      data: updateReportDto,
      include: this.include,
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
