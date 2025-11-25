import { Module } from '@nestjs/common';
import { PetModule } from './pet/pet.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PetModule,
    UserModule,
    ReportModule,
    AuthModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
