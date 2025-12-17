import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { Pet } from '../entities/pet.entity';
import PetMapper from '../mappers/pet.mapper';
import { PET_FULL_RELATIONS } from 'src/constants/includes.constants';

@Injectable()
export class PetService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetDto: CreatePetDto): Promise<Pet> {
    const result = await this.dbService.pet.create({
      data: createPetDto,
    });

    const entity = await this.findOne(result.id);

    if (!entity) throw new Error('pet not found after creation');
    else return entity;
  }

  public async findAll(): Promise<Pet[]> {
    const results = await this.dbService.pet.findMany({
      include: PET_FULL_RELATIONS,
    });

    if (!results || results.length === 0)
      throw new NotFoundException('not pets found');

    return PetMapper.toDomainArray(results);
  }

  public async findOne(id: number): Promise<Pet> {
    const result = await this.dbService.pet.findUnique({
      where: { id },
      include: PET_FULL_RELATIONS,
    });

    if (!result) throw new NotFoundException(`no pet found for id ${id}`);
    return PetMapper.toDomain(result);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.pet.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
