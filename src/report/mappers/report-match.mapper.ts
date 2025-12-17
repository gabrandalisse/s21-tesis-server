import { ReportMatch as PrismaReportMatch } from '../../../generated/prisma';
import { Report } from '../entities/report.entity';
import { ReportMatch } from '../entities/report-match.entity';

export default class ReportMatchMapper {
  public static toDomain(prismaMatch: PrismaReportMatch): ReportMatch {
    return new ReportMatch(
      prismaMatch.id,
      prismaMatch.foundReportId,
      prismaMatch.matchScore,
      prismaMatch.distanceKilometers,
      prismaMatch.status,
      prismaMatch.createdAt,
    );
  }

  public static toDomainArray(
    prismaReports: PrismaReportMatch[],
  ): ReportMatch[] {
    return prismaReports.map((r) => this.toDomain(r));
  }
}
