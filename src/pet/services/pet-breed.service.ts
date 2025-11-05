import { Injectable } from '@nestjs/common';
import { PetBreed } from '../entities/pet-breed.entity';
import { CreatePetBreedDto } from '../dto/create-pet-breed.dto';
import { UpdatePetBreedDto } from '../dto/update-pet-breed.dto';

@Injectable()
export class PetBreedService {
  private readonly petBreeds: PetBreed[] = [];

  create(createPetBreedDto: CreatePetBreedDto): PetBreed {
    const newPetBreed = {
      id: this.petBreeds.length + 1,
      ...createPetBreedDto,
    };

    this.petBreeds.push(newPetBreed);

    return newPetBreed;
  }

  findAll() {
    return this.petBreeds;
  }

  findOne(id: number): PetBreed | undefined {
    return this.petBreeds.find((breed) => breed.id === id);
  }

  update(
    id: number,
    updatePetBreedDto: UpdatePetBreedDto,
  ): PetBreed | undefined {
    const petBreed = this.petBreeds.find((breed) => breed.id === id);

    if (petBreed) {
      Object.assign(petBreed, updatePetBreedDto);
    }

    return petBreed;
  }

  remove(id: number): { deleted: boolean } {
    const index = this.petBreeds.findIndex((breed) => breed.id === id);

    if (index !== -1) {
      this.petBreeds.splice(index, 1);
      return { deleted: true };
    }

    return { deleted: false };
  }
}
