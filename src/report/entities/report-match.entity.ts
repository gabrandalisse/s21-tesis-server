export class ReportMatch {
  constructor(
    private readonly id: number,
    private readonly lostReportId: number,
    private readonly foundReportId: number,
    private readonly matchScore: number,
    private readonly distanceKilometers: number,
    private readonly status: string,
    private readonly createdAt: Date,
  ) {}

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = this;
    return rest;
  }
}
