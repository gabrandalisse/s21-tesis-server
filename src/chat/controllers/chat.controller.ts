import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  createChat(
    @Body() createChatDto: CreateChatDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.chatService.createChat(createChatDto, req.user.id);
  }

  @Get()
  getUserChats(@Request() req: AuthenticatedRequest) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Get(':id')
  getChatById(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.chatService.getChatById(+id, req.user.id);
  }

  @Post('message')
  sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.chatService.sendMessage(createMessageDto, req.user.id);
  }

  @Patch(':id/read')
  markMessagesAsRead(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.chatService.markMessagesAsRead(+id, req.user.id);
  }
}
