import UserMapper from 'src/user/mappers/user.mapper';
import {
  Pet as PrismaPet,
  PetType as PrismaPetType,
  PetBreed as PrismaPetBreed,
  PetSize as PrismaPetSize,
  PetColor as PrismaPetColor,
  PetSex as PrismaPetSex,
  User as PrismaUser,
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
  user: PrismaUser;
};

export default class PetMapper {
  static toDomain(prismaPet: PrismaPetWithRelations): Pet {
    return new Pet(
      prismaPet.id,
      UserMapper.toDomain(prismaPet.user),
      prismaPet.name,
      PetTypeMapper.toDomain(prismaPet.type),
      PetBreedMapper.toDomain(prismaPet.breed),
      PetColorMapper.toDomain(prismaPet.color),
      PetSizeMapper.toDomain(prismaPet.size),
      PetSexMapper.toDomain(prismaPet.sex),
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
