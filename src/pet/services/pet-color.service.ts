import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PetColor } from '../entities/pet-color.entity';
import { CreatePetColorDto } from '../dto/create-pet-color.dto';

@Injectable()
export class PetColorService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetColorDto: CreatePetColorDto): Promise<PetColor> {
    return await this.dbService.petColor.create({
      data: createPetColorDto,
    });
  }

  public async findAll(): Promise<PetColor[]> {
    return this.dbService.petColor.findMany();
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petColor.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
