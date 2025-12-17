import UserMapper, {
  PrismaUserWithRelations,
} from 'src/user/mappers/user.mapper';
import {
  Pet as PrismaPet,
  PetType as PrismaPetType,
  PetBreed as PrismaPetBreed,
  PetSize as PrismaPetSize,
  PetColor as PrismaPetColor,
  PetSex as PrismaPetSex,
} from '../../../generated/prisma';
import { Pet } from '../entities/pet.entity';
import PetBreedMapper from './pet-breed.mapper';
import PetColorMapper from './pet-color.mapper';
import PetSexMapper from './pet-sex.mapper';
import PetSizeMapper from './pet-size.mapper';
import PetTypeMapper from './pet-type.mapper';

type PrismaPetWithRelations = PrismaPet & {
  type: PrismaPetType;
  breed: PrismaPetBreed;
  size: PrismaPetSize;
  color: PrismaPetColor;
  sex: PrismaPetSex;
  owner: PrismaUserWithRelations;
};

export default class PetMapper {
  static toDomain(prismaPet: PrismaPetWithRelations): Pet {
    return new Pet(
      prismaPet.id,
      UserMapper.toDomain(prismaPet.owner),
      prismaPet.name,
      PetTypeMapper.toDomain(prismaPet.type).getName(),
      PetBreedMapper.toDomain(prismaPet.breed).getName(),
      PetColorMapper.toDomain(prismaPet.color).getName(),
      PetSizeMapper.toDomain(prismaPet.size).getName(),
      PetSexMapper.toDomain(prismaPet.sex).getName(),
      prismaPet.age,
      prismaPet.photoUrl,
      prismaPet.distinctiveCharacteristics ?? undefined,
      prismaPet.createdAt,
      [],
    );
  }

  static toDomainArray(prismaPets: PrismaPetWithRelations[]): Pet[] {
    return prismaPets.map((p) => this.toDomain(p));
  }
}
