export class PetBreed {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly typeId: number,
    private readonly createdAt: Date,
  ) {}

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getTypeId(): number {
    return this.typeId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
