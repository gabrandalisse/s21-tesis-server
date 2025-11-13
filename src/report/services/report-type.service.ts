import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ReportType } from '../entities/report-type.entity';
import ReportTypeMapper from '../mappers/report-type.mapper';
import { CreateReportTypeDto } from '../dto/create-report-type.dto';

@Injectable()
export class ReportTypeService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(
    createReportTypeDto: CreateReportTypeDto,
  ): Promise<ReportType> {
    const result = await this.dbService.reportType.create({
      data: createReportTypeDto,
    });

    return ReportTypeMapper.toDomain(result);
  }

  public async findAll(): Promise<ReportType[]> {
    const results = await this.dbService.reportType.findMany();
    return ReportTypeMapper.toDomainArray(results);
  }

  public async findOne(id: number): Promise<ReportType | null> {
    const result = await this.dbService.reportType.findUnique({
      where: { id },
    });

    if (!result) return null;
    return ReportTypeMapper.toDomain(result);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.reportType.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
