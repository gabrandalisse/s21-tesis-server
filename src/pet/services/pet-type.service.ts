import { Injectable } from '@nestjs/common';
import { CreatePetTypeDto } from '../dto/create-pet-type.dto';
import { UpdatePetTypeDto } from '../dto/update-pet-type.dto';
import { PetType } from '../entities/pet-type.entity';

@Injectable()
export class PetTypeService {
  private readonly petTypes: PetType[] = [];

  create(createPetTypeDto: CreatePetTypeDto) {
    const newPetType = {
      id: this.petTypes.length + 1,
      ...createPetTypeDto,
    };

    this.petTypes.push(newPetType);

    return newPetType;
  }

  findAll() {
    return this.petTypes;
  }

  findOne(id: number) {
    return this.petTypes.find((type) => type.id === id);
  }

  update(id: number, updatePetTypeDto: UpdatePetTypeDto) {
    const petType = this.petTypes.find((type) => type.id === id);

    if (petType) {
      Object.assign(petType, updatePetTypeDto);
    }

    return petType;
  }

  remove(id: number) {
    const index = this.petTypes.findIndex((type) => type.id === id);

    if (index !== -1) {
      this.petTypes.splice(index, 1);
      return { deleted: true };
    }

    return { deleted: false };
  }
}
