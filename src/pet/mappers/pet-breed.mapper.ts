import { PetBreed as PrismaPetBreed } from '../../../generated/prisma';
import { PetBreed } from '../entities/pet-breed.entity';

export default class PetBreedMapper {
  static toDomain(prismaPetBreed: PrismaPetBreed): PetBreed {
    return new PetBreed(
      prismaPetBreed.id,
      prismaPetBreed.name,
      prismaPetBreed.typeId,
      prismaPetBreed.createdAt,
    );
  }

  static toDomainArray(prismaPetBreeds: PrismaPetBreed[]): PetBreed[] {
    return prismaPetBreeds.map((pb) => this.toDomain(pb));
  }
}
