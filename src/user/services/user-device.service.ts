import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDeviceDto } from '../dto/create-user-device.dto';
import { UserDevice } from '../entities/user-device.entity';
import UserDeviceMapper from '../mappers/user-device.mapper';

@Injectable()
export class UserDeviceService {
  constructor(private readonly dbService: DatabaseService) {}

  public async create(
    createUserDeviceDto: CreateUserDeviceDto,
  ): Promise<UserDevice> {
    const model = await this.dbService.userDevice.create({
      data: createUserDeviceDto,
    });

    return UserDeviceMapper.toDomain(model);
  }

  public async findAll(): Promise<UserDevice[]> {
    const models = await this.dbService.userDevice.findMany();
    return UserDeviceMapper.toDomainArray(models);
  }

  public async findOne(id: number): Promise<UserDevice | null> {
    const model = await this.dbService.userDevice.findUnique({
      where: { id },
    });

    if (model) return UserDeviceMapper.toDomain(model);
    else return null;
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.userDevice.deleteMany({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
