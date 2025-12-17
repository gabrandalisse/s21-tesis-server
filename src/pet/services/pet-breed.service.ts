import { Injectable, NotFoundException } from '@nestjs/common';
import { PetBreed } from '../entities/pet-breed.entity';
import { CreatePetBreedDto } from '../dto/create-pet-breed.dto';
import { DatabaseService } from 'src/database/database.service';
import PetBreedMapper from '../mappers/pet-breed.mapper';

@Injectable()
export class PetBreedService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetBreedDto: CreatePetBreedDto): Promise<PetBreed> {
    const result = await this.dbService.petBreed.create({
      data: createPetBreedDto,
    });
    return PetBreedMapper.toDomain(result);
  }

  public async findAll(): Promise<PetBreed[]> {
    const results = await this.dbService.petBreed.findMany();

    if (!results || results.length === 0)
      throw new NotFoundException('no pet breed found');

    return PetBreedMapper.toDomainArray(results);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petBreed.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
