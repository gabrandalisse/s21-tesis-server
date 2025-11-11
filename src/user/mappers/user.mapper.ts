import { User as PrismaUser } from 'generated/prisma';
import { User } from '../entities/user.entity';

export default class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.password,
      prismaUser.location,
      prismaUser.createdAt,
    );
  }

  static toDomainArray(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((u) => this.toDomain(u));
  }
}
