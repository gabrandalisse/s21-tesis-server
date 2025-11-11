import { User } from 'src/user/entities/user.entity';
import { PetType } from './pet-type.entity';
import { PetBreed } from './pet-breed.entity';
import { PetColor } from './pet-color.entity';
import { PetSize } from './pet-size.entity';
import { PetSex } from './pet-sex.entity';

export class Pet {
  constructor(
    private readonly id: number,
    private readonly user: User,
    private readonly name: string,
    private readonly type: PetType,
    private readonly breed: PetBreed,
    private readonly color: PetColor,
    private readonly size: PetSize,
    private readonly sex: PetSex,
    private readonly age: number,
    private readonly photoUrl: string,
    private readonly distinctiveCharacteristics: string | undefined,
    private readonly createdAt: Date,
    private readonly reports: any[],
  ) {}
}
