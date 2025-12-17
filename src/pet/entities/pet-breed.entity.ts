export class PetBreed {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly typeId: number,
    private readonly createdAt: Date,
  ) {}

  public getName(): string {
    return this.name;
  }
}
