import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { Pet } from '../entities/pet.entity';

@Injectable()
export class PetService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createPetDto: CreatePetDto): Promise<Pet> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await this.dbService.pet.create({
      data: createPetDto,
    })) as any;
  }

  public async findAll(): Promise<Pet[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await this.dbService.pet.findMany({
      include: {
        type: true,
        breed: true,
        size: true,
        sex: true,
        color: true,
        user: true,
      },
    })) as any;
  }

  public async findOne(id: number): Promise<Pet | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await this.dbService.pet.findUnique({
      where: { id },
      include: {
        type: true,
        breed: true,
        size: true,
        sex: true,
        color: true,
        user: true,
      },
    })) as any;
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.pet.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
