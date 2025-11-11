import { PetColor as PrismaPetColor } from '../../../generated/prisma';
import { PetColor } from '../entities/pet-color.entity';

export default class PetColorMapper {
  static toDomain(prismaPetColor: PrismaPetColor): PetColor {
    return new PetColor(
      prismaPetColor.id,
      prismaPetColor.name,
      prismaPetColor.createdAt,
    );
  }

  static toDomainArray(prismaPetColors: PrismaPetColor[]): PetColor[] {
    return prismaPetColors.map((pc) => this.toDomain(pc));
  }
}
