import { Report } from './report.entity';

export class ReportMatch {
  constructor(
    private readonly id: number,
    private readonly lostReport: Report,
    private readonly foundReport: Report,
    private readonly matchScore: number,
    private readonly distanceKilometers: number,
    private readonly status: string,
    private readonly createdAt: Date,
  ) {}
}
