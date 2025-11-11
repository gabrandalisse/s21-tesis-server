export class PetType {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly createdAt: Date,
    private readonly breeds_id?: number[],
  ) {}
}
