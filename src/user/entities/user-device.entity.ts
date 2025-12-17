export class UserDevice {
  constructor(
    private readonly id: number,
    private readonly token: string,
    private readonly platform: string,
    private readonly createdAt: Date,
  ) {}

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = this;
    return rest;
  }
}
