import { Module } from '@nestjs/common';
import { PetModule } from './pet/pet.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
