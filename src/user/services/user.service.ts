import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import UserMapper from '../mappers/user.mapper';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USER_WITH_DEVICES } from 'src/constants/includes.constants';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const model = await this.dbService.user.create({
      data: createUserDto,
      include: USER_WITH_DEVICES,
    });

    return UserMapper.toDomain(model);
  }

  public async findAll(): Promise<User[]> {
    const models = await this.dbService.user.findMany({
      include: USER_WITH_DEVICES,
    });

    return UserMapper.toDomainArray(models);
  }

  public async findOne(id: number): Promise<User | null> {
    const model = await this.dbService.user.findUnique({
      where: { id },
      include: USER_WITH_DEVICES,
    });

    if (model) return UserMapper.toDomain(model);
    else return null;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const model = await this.dbService.user.update({
      where: { id },
      data: updateUserDto,
      include: USER_WITH_DEVICES,
    });

    return UserMapper.toDomain(model);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.user.deleteMany({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
