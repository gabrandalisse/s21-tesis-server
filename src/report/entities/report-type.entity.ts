export class ReportType {
  constructor(
    private readonly id: number,
    private readonly _name: string,
    private readonly createdAt: Date,
  ) {}

  get name(): string {
    return this._name;
  }
}
