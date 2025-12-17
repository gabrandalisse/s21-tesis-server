import { Injectable, Logger } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { ReportService } from './report.service';
import { ReportTypeEnum } from 'src/enums/report.enums';
import { DatabaseService } from 'src/database/database.service';
import { CreateReportMatchDto } from '../dto/create-report-match.dto';
import DistanceUtils from 'src/utils/distance.utils';
// import ReportMatchMapper from '../mappers/report-match.mapper';
import { ReportMatch } from '../entities/report-match.entity';
import { Pet } from 'src/pet/entities/pet.entity';

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
    });

    // const match = ReportMatchMapper.toDomain(result);
    // this.logger.log(`match created ${JSON.stringify(match)}`);

    console.log('\nRESULT', JSON.stringify(result), '\n');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result as any;
  }

  public async findMatches(lostReport: Report): Promise<ReportMatch[]> {
    this.logger.log(
      `finding matches for lost report with id: ${lostReport.getId()}`,
    );

    const foundReports = await this.getFoundReports(
      lostReport.getLat(),
      lostReport.getLong(),
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
      this.logger.log(`found pet ${JSON.stringify(found.getPet())}`);
      this.logger.log(`lost pet ${JSON.stringify(lost.getPet())}`);

      const score = this.calculateMatchScore(lost.getPet(), found.getPet());

      this.logger.log(`score for found report id ${found.getId()} is ${score}`);

      if (score >= 0.5) {
        const distanceKilometers = DistanceUtils.haversineDistance(
          found.getLat(),
          found.getLong(),
          lost.getLat(),
          lost.getLong(),
        );

        const match = await this.create({
          lostReportId: lost.getId(),
          foundReportId: found.getId(),
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

  private calculateMatchScore(lost: Pet, found: Pet): number {
    let score = 0;

    if (found.getBreed() === lost.getBreed()) score += 0.3;
    if (found.getSex() === lost.getSex()) score += 0.3;
    if (found.getType() === lost.getType()) score += 0.2;
    if (found.getColor() === lost.getColor()) score += 0.1;
    if (found.getSize() === lost.getSize()) score += 0.1;

    return score;
  }
}
