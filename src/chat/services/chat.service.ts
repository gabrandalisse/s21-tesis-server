import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async createChat(createChatDto: CreateChatDto, creatorId: number) {
    this.logger.log(`Creating chat for report ${createChatDto.reportId} with participants: ${createChatDto.participantIds.join(', ')}`);

    // Check if chat already exists for this report and participants
    const existingChat = await this.dbService.chat.findFirst({
      where: {
        reportId: createChatDto.reportId,
        participants: {
          every: {
            userId: { in: [...createChatDto.participantIds, creatorId] }
          }
        }
      },
      include: {
        participants: {
          include: { user: true }
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const chat = await this.dbService.chat.create({
      data: {
        reportId: createChatDto.reportId,
        participants: {
          create: [
            ...createChatDto.participantIds.map(userId => ({ userId })),
            { userId: creatorId }
          ]
        }
      },
      include: {
        participants: {
          include: { user: true }
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return chat;
  }

  async getUserChats(userId: number) {
    this.logger.log(`Getting chats for user ${userId}`);

    const chats = await this.dbService.chat.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        report: {
          include: {
            pet: true,
            reportType: true,
            reportedBy: true
          }
        },
        participants: {
          include: { user: true }
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 1 // Get only the last message for preview
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return chats;
  }

  async getChatById(chatId: number, userId: number) {
    this.logger.log(`Getting chat ${chatId} for user ${userId}`);

    const chat = await this.dbService.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: { userId }
        }
      },
      include: {
        report: {
          include: {
            pet: true,
            reportType: true,
            reportedBy: true
          }
        },
        participants: {
          include: { user: true }
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) {
      throw new NotFoundException(`Chat ${chatId} not found or access denied`);
    }

    return chat;
  }

  async sendMessage(createMessageDto: CreateMessageDto, senderId: number) {
    this.logger.log(`Sending message to chat ${createMessageDto.chatId} from user ${senderId}`);

    // Verify user is participant in the chat
    const chat = await this.dbService.chat.findFirst({
      where: {
        id: createMessageDto.chatId,
        participants: {
          some: { userId: senderId }
        }
      }
    });

    if (!chat) {
      throw new BadRequestException('You are not a participant in this chat');
    }

    const message = await this.dbService.message.create({
      data: {
        chatId: createMessageDto.chatId,
        senderId,
        content: createMessageDto.content
      },
      include: {
        sender: true,
        chat: {
          include: {
            participants: {
              include: { user: true }
            }
          }
        }
      }
    });

    // Update chat's updatedAt timestamp
    await this.dbService.chat.update({
      where: { id: createMessageDto.chatId },
      data: { updatedAt: new Date() }
    });

    return message;
  }

  async markMessagesAsRead(chatId: number, userId: number) {
    this.logger.log(`Marking messages as read in chat ${chatId} for user ${userId}`);

    // Verify user is participant in the chat
    const chat = await this.dbService.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: { userId }
        }
      }
    });

    if (!chat) {
      throw new BadRequestException('You are not a participant in this chat');
    }

    // Mark all messages in this chat as read (except the user's own messages)
    await this.dbService.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        read: false
      },
      data: { read: true }
    });

    return { success: true };
  }
}