import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserDeviceService } from './services/user-device.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDeviceService],
  imports: [DatabaseModule],
})
export class UserModule {}
