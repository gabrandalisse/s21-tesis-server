import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    req: Request,
    email: string,
    password: string,
  ): Promise<User | null> {
    const { lat, long } = req.body as unknown as { lat: number; long: number };
    const user = await this.userService.findOneByEmail(email);

    // TODO add hashing, in the future...
    if (user && user.getPassword() === password) {
      await this.userService.update(user.getId(), { lat, long });
      return user;
    }

    return null;
  }

  public login(user: User): { access_token: string } {
    const payload: Partial<JwtPayload> = {
      email: user.getEmail(),
      id: user.getId(),
      lat: user.getLat(),
      long: user.getLong(),
    };

    this.logger.log(`Signing JWT with payload: ${JSON.stringify(payload)}`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
