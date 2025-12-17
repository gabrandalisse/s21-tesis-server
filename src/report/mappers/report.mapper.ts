import {
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
  ReportMatch as PrismaReportMatch,
} from '../../../generated/prisma';
import { Report } from '../entities/report.entity';
import PetMapper from 'src/pet/mappers/pet.mapper';
import ReportTypeMapper from './report-type.mapper';
import UserMapper from 'src/user/mappers/user.mapper';
import ReportMatchMapper from './report-match.mapper';

type PrismaReportBase = PrismaReport & {
  pet: PrismaPet & {
    type: PrismaPetType;
    breed: PrismaPetBreed;
    size: PrismaPetSize;
    color: PrismaPetColor;
    sex: PrismaPetSex;
    owner: PrismaUser & { devices: PrismaUserDevice[] };
  };
  reportType: PrismaReportType;
  reportedBy: PrismaUser & { devices: PrismaUserDevice[] };
  matches: PrismaReportMatch[];
};

export default class ReportMapper {
  static toDomain(prismaReport: PrismaReportBase): Report {
    return new Report(
      prismaReport.id,
      PetMapper.toDomain(prismaReport.pet),
      ReportTypeMapper.toDomain(prismaReport.reportType).getName(),
      prismaReport.description,
      prismaReport.photoUrl,
      prismaReport.lat,
      prismaReport.long,
      prismaReport.resolved,
      UserMapper.toDomain(prismaReport.reportedBy),
      prismaReport.reportedAt,
      prismaReport.resolvedAt,
      ReportMatchMapper.toDomainArray(prismaReport.matches),
    );
  }

  public static toDomainArray(prismaReports: PrismaReportBase[]): Report[] {
    return prismaReports.map((r) => this.toDomain(r));
  }
}
