import { User } from 'src/user/entities/user.entity';

export class Pet {
  constructor(
    private readonly id: number,
    private readonly owner: User,
    private readonly name: string,
    private readonly type: string,
    private readonly breed: string,
    private readonly color: string,
    private readonly size: string,
    private readonly sex: string,
    private readonly age: number,
    private readonly photoUrl: string,
    private readonly distinctiveCharacteristics: string | undefined,
    private readonly createdAt: Date,
    private readonly reports: any[],
  ) {}

  public getType(): string {
    return this.type;
  }

  public getBreed(): string {
    return this.breed;
  }

  public getColor(): string {
    return this.color;
  }

  public getSize(): string {
    return this.size;
  }

  public getSex(): string {
    return this.sex;
  }

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reports, ...rest } = this;
    return rest;
  }
}
