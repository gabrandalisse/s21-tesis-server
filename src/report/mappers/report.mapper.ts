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
} from '../../../generated/prisma';
import { Report } from '../entities/report.entity';
import PetMapper from 'src/pet/mappers/pet.mapper';
import ReportTypeMapper from './report-type.mapper';
import UserMapper from 'src/user/mappers/user.mapper';

type PrismaReportWithRelations = PrismaReport & {
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

export default class ReportMapper {
  static toDomain(prismaReport: PrismaReportWithRelations): Report {
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
    );
  }

  static toDomainArray(prismaReports: PrismaReportWithRelations[]): Report[] {
    return prismaReports.map((r) => this.toDomain(r));
  }
}
