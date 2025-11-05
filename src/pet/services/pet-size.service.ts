import { Injectable } from '@nestjs/common';
import { CreatePetSizeDto } from '../dto/create-pet-size.dto';
import { PetSize } from '../entities/pet-size.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PetSizeService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetSizeDto: CreatePetSizeDto): Promise<PetSize> {
    return await this.dbService.petSize.create({
      data: createPetSizeDto,
    });
  }

  public async findAll(): Promise<PetSize[]> {
    return this.dbService.petSize.findMany();
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.petSize.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
