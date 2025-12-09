export class PetSex {
  constructor(
    private readonly id: number,
    public readonly name: string,
    private readonly createdAt: Date,
  ) {}
}
