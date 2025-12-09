import { Injectable, Logger } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { ReportService } from './report.service';
import { ReportTypeEnum } from 'src/enums/report.enums';
import { DatabaseService } from 'src/database/database.service';
import { CreateReportMatchDto } from '../dto/create-report-match.dto';
import DistanceUtils from 'src/utils/distance.utils';
import { REPORT_BASE_RELATIONS } from 'src/constants/includes.constants';
import ReportMatchMapper from '../mappers/report-match.mapper';
import { ReportMatch } from '../entities/report-match.entity';

@Injectable()
export class ReportMatchService {
  private readonly logger = new Logger(ReportMatchService.name);

  constructor(
    private readonly reportService: ReportService,
    private readonly dbService: DatabaseService,
  ) {}

  public async create(
    createReportMatchDto: CreateReportMatchDto,
  ): Promise<ReportMatch> {
    const result = await this.dbService.reportMatch.create({
      data: createReportMatchDto,
      include: {
        lostReport: { include: REPORT_BASE_RELATIONS },
        foundReport: { include: REPORT_BASE_RELATIONS },
      },
    });

    const match = ReportMatchMapper.toDomain(result);
    this.logger.log(`match created ${JSON.stringify(match)}`);

    return match;
  }

  public async findMatches(lostReport: Report): Promise<ReportMatch[]> {
    this.logger.log(
      `finding matches for lost report with id: ${lostReport.id}`,
    );

    const foundReports = await this.getFoundReports(
      lostReport.lat,
      lostReport.long,
    );

    const matches = await this.getReportMatches(foundReports, lostReport);

    this.logger.log(`matches found ${JSON.stringify(matches)}`);

    return matches;
  }

  private async getFoundReports(lat: number, long: number): Promise<Report[]> {
    const foundReports = await this.reportService.findAllByLatAndLong(
      lat,
      long,
      { reportType: { name: ReportTypeEnum.FOUND } },
    );

    this.logger.log(
      `Found ${foundReports.length} found reports near lat ${lat} and long ${long}`,
    );

    return foundReports;
  }

  private async getReportMatches(
    founds: Report[],
    lost: Report,
  ): Promise<ReportMatch[]> {
    const matches: ReportMatch[] = [];

    for (const found of founds) {
      let score = 0;

      this.logger.log(`found pet ${JSON.stringify(found.pet)}`);
      this.logger.log(`lost pet ${JSON.stringify(lost.pet)}`);

      if (found.pet.breed.name === lost.pet.breed.name) score += 0.3;
      if (found.pet.sex.name === lost.pet.sex.name) score += 0.3;
      if (found.pet.type.name === lost.pet.type.name) score += 0.2;
      if (found.pet.color.name === lost.pet.color.name) score += 0.1;
      if (found.pet.size.name === lost.pet.size.name) score += 0.1;

      this.logger.log(`score for found report id ${found.id} is ${score}`);

      if (score >= 0.5) {
        const distanceKilometers = DistanceUtils.haversineDistance(
          found.lat,
          found.long,
          lost.lat,
          lost.long,
        );

        const match = await this.create({
          lostReportId: lost.id,
          foundReportId: found.id,
          matchScore: score,
          distanceKilometers,
          // TODO agregar a constant
          status: 'pending',
        });

        matches.push(match);
      }
    }

    return matches;
  }
}
