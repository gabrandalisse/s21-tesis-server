import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { ReportService } from './report.service';
import { ReportTypeEnum } from 'src/enums/report.enums';
import { DatabaseService } from 'src/database/database.service';
import { CreateReportMatchDto } from '../dto/create-report-match.dto';
import DistanceUtils from 'src/utils/distance.utils';
import { ReportMatch } from '../entities/report-match.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import ReportMatchMapper from '../mappers/report-match.mapper';
import { ReportMatchStatus } from 'src/enums/report-match.enums';

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

    const match = ReportMatchMapper.toDomain(result);
    this.logger.log(`match created ${JSON.stringify(match)}`);

    return match;
  }

  public async findMatchByLostReportId(id: number): Promise<ReportMatch> {
    const result = await this.dbService.reportMatch.findFirst({
      where: { lostReportId: id },
    });

    if (!result)
      throw new NotFoundException(`no matches found for lost report id ${id}`);

    return ReportMatchMapper.toDomain(result);
  }

  public async findAllMatchesByLostReportId(
    id: number,
  ): Promise<ReportMatch[]> {
    const results = await this.dbService.reportMatch.findMany({
      where: { lostReportId: id },
      orderBy: { matchScore: 'desc' }, // Order by best matches first
    });

    return ReportMatchMapper.toDomainArray(results);
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
    // We need to get found reports, but the current service method doesn't support filtering by report type
    // For now, let's get all reports and filter them manually
    const allReports = await this.reportService.findAllByLatAndLong(lat, long, {
      includeResolved: false,
    });

    // Filter for found reports only
    const foundReports = allReports.filter(
      (report) => report.getType() === ReportTypeEnum.FOUND,
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
          status: ReportMatchStatus.PENDING,
        });

        matches.push(match);
      }
    }

    return matches;
  }

  private calculateMatchScore(lost: Pet, found: Pet): number {
    let score = 0;

    // TODO agregar distinctive caracteristic
    // TODO agregar descripcion del report

    this.logger.log(
      `Comparing pets - Lost: breed=${lost.getBreed()}, sex=${lost.getSex()}, type=${lost.getType()}, color=${lost.getColor()}, size=${lost.getSize()}`,
    );
    this.logger.log(
      `Comparing pets - Found: breed=${found.getBreed()}, sex=${found.getSex()}, type=${found.getType()}, color=${found.getColor()}, size=${found.getSize()}`,
    );

    if (found.getBreed() === lost.getBreed()) {
      score += 0.3;
      this.logger.log(`Breed match: ${found.getBreed()}`);
    }
    if (found.getSex() === lost.getSex()) {
      score += 0.3;
      this.logger.log(`Sex match: ${found.getSex()}`);
    }
    if (found.getType() === lost.getType()) {
      score += 0.2;
      this.logger.log(`Type match: ${found.getType()}`);
    }
    if (found.getColor() === lost.getColor()) {
      score += 0.1;
      this.logger.log(`Color match: ${found.getColor()}`);
    }
    if (found.getSize() === lost.getSize()) {
      score += 0.1;
      this.logger.log(`Size match: ${found.getSize()}`);
    }

    return score;
  }
}
