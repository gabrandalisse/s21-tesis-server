import { UserDevice as PrismaUserDevice } from 'generated/prisma';
import { UserDevice } from '../entities/user-device.entity';

export default class UserDeviceMapper {
  static toDomain(prismaUser: PrismaUserDevice): UserDevice {
    return new UserDevice(
      prismaUser.id,
      prismaUser.token,
      prismaUser.platform,
      prismaUser.createdAt,
    );
  }

  static toDomainArray(prismaUsers: PrismaUserDevice[]): UserDevice[] {
    return prismaUsers.map((u) => this.toDomain(u));
  }
}
