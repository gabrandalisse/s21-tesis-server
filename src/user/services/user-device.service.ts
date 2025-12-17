import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (!models || models.length === 0)
      throw new NotFoundException('no user devices found');

    return UserDeviceMapper.toDomainArray(models);
  }

  public async findOne(id: number): Promise<UserDevice> {
    const model = await this.dbService.userDevice.findUnique({
      where: { id },
    });

    if (!model)
      throw new NotFoundException(`no user device found for id ${id}`);

    return UserDeviceMapper.toDomain(model);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.userDevice.deleteMany({
      where: { id },
    });

    return { deleted: result !== null };
  }
}
