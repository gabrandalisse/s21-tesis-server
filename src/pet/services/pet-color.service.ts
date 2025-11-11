import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PetColor } from '../entities/pet-color.entity';
import { CreatePetColorDto } from '../dto/create-pet-color.dto';
import PetColorMapper from '../mappers/pet-color.mapper';

@Injectable()
export class PetColorService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetColorDto: CreatePetColorDto): Promise<PetColor> {
    const result = await this.dbService.petColor.create({
      data: createPetColorDto,
    });
    return PetColorMapper.toDomain(result);
  }

  public async findAll(): Promise<PetColor[]> {
    const results = await this.dbService.petColor.findMany();
    return PetColorMapper.toDomainArray(results);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petColor.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
