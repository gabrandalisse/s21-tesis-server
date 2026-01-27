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

  static toJSON(petBreed: PetBreed) {
    return {
      id: petBreed.getId(),
      name: petBreed.getName(),
      typeId: petBreed.getTypeId(),
      createdAt: petBreed.getCreatedAt(),
    };
  }

  static toJSONArray(petBreeds: PetBreed[]) {
    return petBreeds.map((pb) => this.toJSON(pb));
  }
}
