import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePetSexDto } from '../dto/create-pet-sex.dto';
import { PetSex } from '../entities/pet-sex.entity';
import PetSexMapper from '../mappers/pet-sex.mapper';

@Injectable()
export class PetSexService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetSexDto: CreatePetSexDto): Promise<PetSex> {
    const result = await this.dbService.petSex.create({
      data: createPetSexDto,
    });
    return PetSexMapper.toDomain(result);
  }

  public async findAll(): Promise<PetSex[]> {
    const results = await this.dbService.petSex.findMany();

    if (!results || results.length === 0)
      throw new NotFoundException('not pet sex found');

    return PetSexMapper.toDomainArray(results);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petSex.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
