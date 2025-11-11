import { PetType as PrismaPetType } from '../../../generated/prisma';
import { PetType } from '../entities/pet-type.entity';

export default class PetTypeMapper {
  static toDomain(prismaPetType: PrismaPetType): PetType {
    return new PetType(
      prismaPetType.id,
      prismaPetType.name,
      prismaPetType.createdAt,
      undefined, // breeds_id - can be populated if needed
    );
  }

  static toDomainArray(prismaPetTypes: PrismaPetType[]): PetType[] {
    return prismaPetTypes.map((pt) => this.toDomain(pt));
  }
}
