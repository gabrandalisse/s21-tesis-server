import { User as PrismaUser } from 'generated/prisma';
import { User } from '../entities/user.entity';
import { Pet as PrismaPet } from 'generated/prisma';

export default class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & {
      pets?: PrismaPet[];
    },
  ): User {
    const user = new User();

    user.id = prismaUser.id;
    user.email = prismaUser.email;
    user.name = prismaUser.name;
    user.password = prismaUser.password;
    user.location = prismaUser.location;
    user.createdAt = prismaUser.createdAt;
    // user.pets = prismaUser.pets || [];
    // TODO fix this then pet has reports
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user.pets = prismaUser.pets as any[];

    return user;
  }

  static toDomainArray(prismaUsers: PrismaUser[]): User[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return prismaUsers.map(this.toDomain);
  }

  static toPrisma(user: User): Omit<PrismaUser, 'id' | 'createdAt' | 'pets'> {
    return {
      email: user.email,
      name: user.name,
      password: user.password,
      location: user.location,
    };
  }
}
