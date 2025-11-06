import { Injectable } from '@nestjs/common';
import { PetBreed } from '../entities/pet-breed.entity';
import { CreatePetBreedDto } from '../dto/create-pet-breed.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PetBreedService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetBreedDto: CreatePetBreedDto): Promise<PetBreed> {
    return await this.dbService.petBreed.create({
      data: createPetBreedDto,
    });
  }

  public async findAll(): Promise<PetBreed[]> {
    return await this.dbService.petBreed.findMany();
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petBreed.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
