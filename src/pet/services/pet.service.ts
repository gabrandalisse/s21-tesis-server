import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { Pet } from '../entities/pet.entity';
import PetMapper from '../mappers/pet.mapper';

@Injectable()
export class PetService {
  constructor(private readonly dbService: DatabaseService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async create(createPetDto: CreatePetDto): Promise<Pet> {
    // const result = await this.dbService.pet.create({
    //   data: createPetDto,
    // });
    // return PetMapper.toDomain(result);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createPetDto as any;
  }

  public async findAll(): Promise<Pet[]> {
    const results = await this.dbService.pet.findMany({
      include: {
        type: true,
        breed: true,
        size: true,
        sex: true,
        color: true,
        user: true,
      },
    });
    return PetMapper.toDomainArray(results);
  }

  public async findOne(id: number): Promise<Pet | null> {
    const result = await this.dbService.pet.findUnique({
      where: { id },
      include: {
        type: true,
        breed: true,
        size: true,
        sex: true,
        color: true,
        user: true,
      },
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
