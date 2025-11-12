import { Module } from '@nestjs/common';
import { PetModule } from './pet/pet.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [ConfigModule.forRoot(), PetModule, UserModule, ReportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
