import { PetSex as PrismaPetSex } from '../../../generated/prisma';
import { PetSex } from '../entities/pet-sex.entity';

export default class PetSexMapper {
  static toDomain(prismaPetSex: PrismaPetSex): PetSex {
    return new PetSex(
      prismaPetSex.id,
      prismaPetSex.name,
      prismaPetSex.createdAt,
    );
  }

  static toDomainArray(prismaPetSexes: PrismaPetSex[]): PetSex[] {
    return prismaPetSexes.map((ps) => this.toDomain(ps));
  }
}
