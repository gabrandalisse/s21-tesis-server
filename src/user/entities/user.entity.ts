import { UserDevice } from './user-device.entity';

export class User {
  constructor(
    private readonly id: number,
    private readonly email: string,
    private readonly name: string,
    private password: string,
    private readonly lat: number,
    private readonly long: number,
    private readonly createdAt: Date,
    private readonly devices: UserDevice[],
  ) {}

  public getId(): number {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getLat(): number {
    return this.lat;
  }

  public getLong(): number {
    return this.long;
  }

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, lat, long, ...rest } = this;
    return rest;
  }
}
