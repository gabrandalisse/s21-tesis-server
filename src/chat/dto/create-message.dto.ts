import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}