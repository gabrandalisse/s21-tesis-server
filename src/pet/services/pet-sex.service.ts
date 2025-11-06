import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePetSexDto } from '../dto/create-pet-sex.dto';
import { PetSex } from '../entities/pet-sex.entity';

@Injectable()
export class PetSexService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetSexDto: CreatePetSexDto): Promise<PetSex> {
    return await this.dbService.petSex.create({
      data: createPetSexDto,
    });
  }

  public async findAll(): Promise<PetSex[]> {
    return this.dbService.petSex.findMany();
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petSex.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
