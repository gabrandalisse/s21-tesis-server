import { ReportType as ReportTypePrisma } from 'generated/prisma';
import { ReportType } from '../entities/report-type.entity';

export default class ReportTypeMapper {
  static toDomain(prismaReportType: ReportTypePrisma): ReportType {
    return new ReportType(
      prismaReportType.id,
      prismaReportType.name,
      prismaReportType.createdAt,
    );
  }

  static toDomainArray(prismaReportTypes: ReportTypePrisma[]): ReportType[] {
    return prismaReportTypes.map((rt) => this.toDomain(rt));
  }
}
