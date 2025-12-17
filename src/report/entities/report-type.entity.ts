export class ReportType {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly createdAt: Date,
  ) {}

  public getName(): string {
    return this.name;
  }
}
