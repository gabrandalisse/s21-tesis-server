import { UserDevice } from './user-device.entity';

export class User {
  constructor(
    private readonly id: number,
    private readonly email: string,
    private readonly name: string,
    private password: string,
    private readonly phone: string | null,
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

  public getName(): string {
    return this.name;
  }

  public getPhone(): string | null {
    return this.phone;
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
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phone: this.phone,
      lat: this.lat,
      long: this.long,
      createdAt: this.createdAt,
    };
  }
}
