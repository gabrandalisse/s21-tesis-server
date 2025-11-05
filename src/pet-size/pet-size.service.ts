import { Injectable } from '@nestjs/common';
import { CreatePetSizeDto } from './dto/create-pet-size.dto';
import { UpdatePetSizeDto } from './dto/update-pet-size.dto';
import { PetSize } from './entities/pet-size.entity';

@Injectable()
export class PetSizeService {
  private readonly petSizes: PetSize[] = [];

  create(createPetSizeDto: CreatePetSizeDto): PetSize {
    const newPetSize = {
      id: this.petSizes.length + 1,
      ...createPetSizeDto,
    };

    this.petSizes.push(newPetSize);

    return newPetSize;
  }

  findAll(): PetSize[] {
    return this.petSizes;
  }

  findOne(id: number): PetSize | undefined {
    return this.petSizes.find((size) => size.id === id);
  }

  update(id: number, updatePetSizeDto: UpdatePetSizeDto): PetSize | undefined {
    const petSize = this.petSizes.find((size) => size.id === id);

    if (petSize) {
      Object.assign(petSize, updatePetSizeDto);
    }

    return petSize;
  }

  remove(id: number): { deleted: boolean } {
    const index = this.petSizes.findIndex((size) => size.id === id);

    if (index !== -1) {
      this.petSizes.splice(index, 1);
      return { deleted: true };
    }

    return { deleted: false };
  }
}
