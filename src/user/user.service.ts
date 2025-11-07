import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from './entities/user.entity';
import UserMapper from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const model = await this.dbService.user.create({
      data: createUserDto,
    });

    return UserMapper.toDomain(model);
  }

  public async findAll(): Promise<User[]> {
    const models = await this.dbService.user.findMany();
    return UserMapper.toDomainArray(models);
  }

  public async findOne(id: number): Promise<User | null> {
    const model = await this.dbService.user.findUnique({
      where: { id },
    });

    if (model) return UserMapper.toDomain(model);
    else return null;
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.user.deleteMany({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
