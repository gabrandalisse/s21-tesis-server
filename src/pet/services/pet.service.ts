import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { Pet } from '../entities/pet.entity';
import PetMapper from '../mappers/pet.mapper';

@Injectable()
export class PetService {
  private readonly include = {
    type: true,
    breed: true,
    size: true,
    sex: true,
    color: true,
    user: true,
  };

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
      include: this.include,
    });

    return PetMapper.toDomainArray(results);
  }

  public async findOne(id: number): Promise<Pet | null> {
    const result = await this.dbService.pet.findUnique({
      where: { id },
      include: this.include,
    });

    if (!result) return null;
    return PetMapper.toDomain(result);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.pet.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
