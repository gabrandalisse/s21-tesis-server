import { UserDevice } from './user-device.entity';

export class User {
  constructor(
    private readonly id: number,
    private readonly email: string,
    private readonly name: string,
    private readonly password: string,
    private readonly lat: number,
    private readonly long: number,
    private readonly createdAt: Date,
    private readonly devices: UserDevice[],
  ) {}

  getId(): number {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}
