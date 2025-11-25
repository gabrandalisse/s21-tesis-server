import {
  ReportMatch as PrismaReportMatch,
  Report as PrismaReport,
  Pet as PrismaPet,
  ReportType as PrismaReportType,
  User as PrismaUser,
  PetType as PrismaPetType,
  PetBreed as PrismaPetBreed,
  PetSize as PrismaPetSize,
  PetColor as PrismaPetColor,
  PetSex as PrismaPetSex,
  UserDevice as PrismaUserDevice,
} from '../../../generated/prisma';
import { ReportMatch } from '../entities/report-match.entity';
import { Report } from '../entities/report.entity';
import PetMapper from 'src/pet/mappers/pet.mapper';
import ReportTypeMapper from './report-type.mapper';
import UserMapper from 'src/user/mappers/user.mapper';

type PrismaReportBase = PrismaReport & {
  pet: PrismaPet & {
    type: PrismaPetType;
    breed: PrismaPetBreed;
    size: PrismaPetSize;
    color: PrismaPetColor;
    sex: PrismaPetSex;
    user: PrismaUser & { devices: PrismaUserDevice[] };
  };
  reportType: PrismaReportType;
  reportedBy: PrismaUser & { devices: PrismaUserDevice[] };
};

type PrismaLostMatchWithRelations = PrismaReportMatch & {
  foundReport: PrismaReportBase;
};

type PrismaFoundMatchWithRelations = PrismaReportMatch & {
  lostReport: PrismaReportBase;
};

export default class ReportMatchMapper {
  public static toDomainFromLostMatch(
    prismaReportMatch: PrismaLostMatchWithRelations,
    currentReport: Report,
  ): ReportMatch {
    return new ReportMatch(
      prismaReportMatch.id,
      currentReport,
      this.mapReportWithoutMatches(prismaReportMatch.foundReport),
      prismaReportMatch.matchScore,
      prismaReportMatch.distanceKilometers,
      prismaReportMatch.status,
      prismaReportMatch.createdAt,
    );
  }

  public static toDomainFromFoundMatch(
    prismaReportMatch: PrismaFoundMatchWithRelations,
    currentReport: Report,
  ): ReportMatch {
    return new ReportMatch(
      prismaReportMatch.id,
      this.mapReportWithoutMatches(prismaReportMatch.lostReport),
      currentReport,
      prismaReportMatch.matchScore,
      prismaReportMatch.distanceKilometers,
      prismaReportMatch.status,
      prismaReportMatch.createdAt,
    );
  }

  public static toDomainArrayFromLostMatches(
    prismaReportMatches: PrismaLostMatchWithRelations[],
    currentReport: Report,
  ): ReportMatch[] {
    return prismaReportMatches.map((rm) =>
      this.toDomainFromLostMatch(rm, currentReport),
    );
  }

  public static toDomainArrayFromFoundMatches(
    prismaReportMatches: PrismaFoundMatchWithRelations[],
    currentReport: Report,
  ): ReportMatch[] {
    return prismaReportMatches.map((rm) =>
      this.toDomainFromFoundMatch(rm, currentReport),
    );
  }

  private static mapReportWithoutMatches(
    prismaReport: PrismaReportBase,
  ): Report {
    return new Report(
      prismaReport.id,
      PetMapper.toDomain(prismaReport.pet),
      ReportTypeMapper.toDomain(prismaReport.reportType),
      prismaReport.description,
      prismaReport.photoUrl,
      prismaReport.lat,
      prismaReport.long,
      prismaReport.resolved,
      UserMapper.toDomain(prismaReport.reportedBy),
      prismaReport.reportedAt,
      prismaReport.resolvedAt,
      [],
      [],
    );
  }
}
