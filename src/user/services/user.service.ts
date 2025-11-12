import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import UserMapper from '../mappers/user.mapper';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly includes = { devices: true };

  constructor(private readonly dbService: DatabaseService) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const model = await this.dbService.user.create({
      data: createUserDto,
    });

    const entity = await this.findOne(model.id);
    if (!entity) throw new Error('user creation failed');
    else return entity;
  }

  public async findAll(): Promise<User[]> {
    const models = await this.dbService.user.findMany({
      include: this.includes,
    });

    return UserMapper.toDomainArray(models);
  }

  public async findOne(id: number): Promise<User | null> {
    const model = await this.dbService.user.findUnique({
      where: { id },
      include: this.includes,
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
