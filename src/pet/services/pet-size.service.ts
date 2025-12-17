import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetSizeDto } from '../dto/create-pet-size.dto';
import { PetSize } from '../entities/pet-size.entity';
import { DatabaseService } from 'src/database/database.service';
import PetSizeMapper from '../mappers/pet-size.mapper';

@Injectable()
export class PetSizeService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetSizeDto: CreatePetSizeDto): Promise<PetSize> {
    const result = await this.dbService.petSize.create({
      data: createPetSizeDto,
    });
    return PetSizeMapper.toDomain(result);
  }

  public async findAll(): Promise<PetSize[]> {
    const results = await this.dbService.petSize.findMany();

    if (!results || results.length === 0)
      throw new NotFoundException('no pet size found');

    return PetSizeMapper.toDomainArray(results);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petSize.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
