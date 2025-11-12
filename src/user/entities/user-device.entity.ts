export class UserDevice {
  constructor(
    private readonly id: number,
    private readonly token: string,
    private readonly platform: string,
    private readonly createdAt: Date,
  ) {}
}
