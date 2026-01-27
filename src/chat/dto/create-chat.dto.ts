import { IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  reportId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  participantIds: number[];
}
