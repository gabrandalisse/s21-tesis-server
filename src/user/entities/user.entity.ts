import { UserDevice } from './user-device.entity';

export class User {
  constructor(
    private readonly id: number,
    private readonly email: string,
    private readonly name: string,
    private readonly password: string,
    private readonly location: string,
    private readonly createdAt: Date,
    private readonly devices: UserDevice[],
  ) {}
}
