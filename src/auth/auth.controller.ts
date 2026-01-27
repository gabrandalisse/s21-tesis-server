/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Create the user
    const user = await this.userService.create(createUserDto);

    // Return the user with access token (auto-login after registration)
    const loginResult = this.authService.login(user);

    return {
      ...loginResult,
      user: {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        phone: user.getPhone(),
        lat: user.getLat(),
        long: user.getLong(),
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    const loginResult = this.authService.login(req.user);

    return {
      ...loginResult,
      user: {
        id: req.user.getId(),
        email: req.user.getEmail(),
        name: req.user.getName(),
        phone: req.user.getPhone(),
        lat: req.user.getLat(),
        long: req.user.getLong(),
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return req.logout();
  }

  // TODO delete
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
