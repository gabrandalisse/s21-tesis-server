export class CreateReportMatchDto {
  lostReportId: number;
  foundReportId: number;
  matchScore: number;
  distanceKilometers: number;
  status: string;
}
