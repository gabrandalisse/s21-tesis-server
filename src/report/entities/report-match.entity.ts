export class ReportMatch {
  constructor(
    public readonly id: number,
    private readonly foundReportId: number,
    private readonly matchScore: number,
    private readonly distanceKilometers: number,
    private readonly status: string,
    private readonly createdAt: Date,
  ) {}

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...rest } = this;
    return rest;
  }
}
