import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateUserDeviceDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsString()
  token: string;

  @IsString()
  platform: string;
}
