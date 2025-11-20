import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findOneByEmail(email);

    if (user && user.getPassword() === password) {
      return user;
    }

    return null;
  }

  public login(user: Partial<User>): { access_token: string } {
    if (!user || !user.getEmail || !user.getId)
      throw new UnauthorizedException();

    const payload: Partial<JwtPayload> = {
      email: user.getEmail(),
      id: user.getId(),
    };

    // TODO aca actualizar lat y long del user

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
