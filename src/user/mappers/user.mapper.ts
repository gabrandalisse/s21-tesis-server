import { User as PrismaUser } from 'generated/prisma';
import { UserDevice as PrismaUserDevice } from 'generated/prisma';
import { User } from '../entities/user.entity';
import UserDeviceMapper from './user-device.mapper';

export type PrismaUserWithRelations = PrismaUser & {
  devices: PrismaUserDevice[];
};

export default class UserMapper {
  static toDomain(prismaUser: PrismaUserWithRelations): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.password,
      prismaUser.phone,
      prismaUser.lat,
      prismaUser.long,
      prismaUser.createdAt,
      UserDeviceMapper.toDomainArray(prismaUser.devices),
    );
  }

  static toDomainArray(prismaUsers: PrismaUserWithRelations[]): User[] {
    return prismaUsers.map((u) => this.toDomain(u));
  }
}
