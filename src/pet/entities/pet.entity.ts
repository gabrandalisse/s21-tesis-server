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

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

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

  public getAge(): number {
    return this.age;
  }

  public getPhotoUrl(): string {
    return this.photoUrl;
  }

  public getDistinctiveCharacteristics(): string | undefined {
    return this.distinctiveCharacteristics;
  }

  public getOwnerId(): number {
    return this.owner.getId();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      userId: this.owner.getId(),
      age: this.age,
      photoUrl: this.photoUrl,
      distinctiveCharacteristics: this.distinctiveCharacteristics,
      createdAt: this.createdAt,
      // Include type info as objects to match frontend expectations
      type: { name: this.type },
      breed: { name: this.breed },
      color: { name: this.color },
      size: { name: this.size },
      sex: { name: this.sex },
    };
  }
}
