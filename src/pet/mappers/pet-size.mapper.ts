import { PetSize as PrismaPetSize } from '../../../generated/prisma';
import { PetSize } from '../entities/pet-size.entity';

export default class PetSizeMapper {
  static toDomain(prismaPetSize: PrismaPetSize): PetSize {
    return new PetSize(
      prismaPetSize.id,
      prismaPetSize.name,
      prismaPetSize.createdAt,
    );
  }

  static toDomainArray(prismaPetSizes: PrismaPetSize[]): PetSize[] {
    return prismaPetSizes.map((ps) => this.toDomain(ps));
  }
}
