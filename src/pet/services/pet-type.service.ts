import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetTypeDto } from '../dto/create-pet-type.dto';
import { DatabaseService } from 'src/database/database.service';
import { PetType } from '../entities/pet-type.entity';
import PetTypeMapper from '../mappers/pet-type.mapper';

@Injectable()
export class PetTypeService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetTypeDto: CreatePetTypeDto): Promise<PetType> {
    const result = await this.dbService.petType.create({
      data: createPetTypeDto,
    });
    return PetTypeMapper.toDomain(result);
  }

  public async findAll(withBreeds: boolean = false): Promise<PetType[]> {
    const results = await this.dbService.petType.findMany({
      include: withBreeds ? { breeds: true } : undefined,
    });

    if (!results || results.length === 0)
      throw new NotFoundException('no pet type found');

    return PetTypeMapper.toDomainArray(results);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petType.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
