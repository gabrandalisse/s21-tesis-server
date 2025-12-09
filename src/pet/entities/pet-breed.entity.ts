export class PetBreed {
  constructor(
    private readonly id: number,
    public readonly name: string,
    private readonly typeId: number,
    private readonly createdAt: Date,
  ) {}
}
