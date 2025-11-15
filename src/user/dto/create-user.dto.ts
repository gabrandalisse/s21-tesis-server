import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  long: number;
}
