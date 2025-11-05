import { Injectable } from '@nestjs/common';
import { CreatePetTypeDto } from '../dto/create-pet-type.dto';
import { DatabaseService } from 'src/database/database.service';
import { PetType } from '../entities/pet-type.entity';

@Injectable()
export class PetTypeService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetTypeDto: CreatePetTypeDto): Promise<PetType> {
    return await this.dbService.petType.create({
      data: createPetTypeDto,
    });
  }

  public findAll(): Promise<PetType[]> {
    return this.dbService.petType.findMany();
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petType.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
