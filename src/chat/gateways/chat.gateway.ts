import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<number, string>(); // userId -> socketId

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake auth or headers
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        client.handshake.query?.token;

      this.logger.log(
        `Connection attempt with token: ${token ? 'Present' : 'Missing'}`,
      );

      if (!token) {
        this.logger.warn('Client connected without token');
        client.disconnect();
        return;
      }

      // Verify JWT token
      this.logger.log('Attempting to verify JWT token...');
      const payload = this.jwtService.verify(token);
      this.logger.log(`JWT payload: ${JSON.stringify(payload)}`);

      // The JWT payload uses 'id' field, not 'sub'
      client.userId = payload.id || payload.sub;

      // Store connection
      if (client.userId) {
        this.connectedUsers.set(client.userId, client.id);
      }

      this.logger.log(
        `User ${client.userId} connected with socket ${client.id}`,
      );

      // Join user to their personal room for notifications
      await client.join(`user_${client.userId}`);
    } catch (error) {
      this.logger.error('Authentication failed for socket connection', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      this.logger.error('Unauthenticated client tried to join chat');
      return { error: 'Not authenticated' };
    }

    this.logger.log(
      `User ${client.userId} attempting to join chat ${data.chatId}`,
    );

    try {
      // Verify user has access to this chat
      await this.chatService.getChatById(data.chatId, client.userId);

      // Join the chat room
      await client.join(`chat_${data.chatId}`);

      this.logger.log(
        `✅ User ${client.userId} successfully joined chat ${data.chatId}`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Failed to join chat ${data.chatId}:`, error);
      return { error: 'Failed to join chat' };
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`chat_${data.chatId}`);
    this.logger.log(`User ${client.userId} left chat ${data.chatId}`);
    return { success: true };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      this.logger.error('Unauthenticated client tried to send message');
      return { error: 'Not authenticated' };
    }

    this.logger.log(
      `Received message from user ${client.userId} for chat ${createMessageDto.chatId}: "${createMessageDto.content}"`,
    );

    try {
      const message = await this.chatService.sendMessage(
        createMessageDto,
        client.userId,
      );

      this.logger.log(
        `Message saved with ID ${message.id}, broadcasting to chat_${createMessageDto.chatId}`,
      );

      // Emit message to all OTHER participants in the chat (exclude sender)
      client.to(`chat_${createMessageDto.chatId}`).emit('new_message', {
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
        senderName: message.sender.name,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
      });

      // Send push notifications to offline users
      const participants = message.chat.participants.filter(
        (p) => p.userId !== client.userId,
      );
      for (const participant of participants) {
        if (!this.connectedUsers.has(participant.userId)) {
          // User is offline, could send push notification here
          this.logger.log(
            `User ${participant.userId} is offline, should send push notification`,
          );
        }
      }

      return { success: true, messageId: message.id };
    } catch (error) {
      this.logger.error('Failed to send message', error);
      return { error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    try {
      await this.chatService.markMessagesAsRead(data.chatId, client.userId);

      // Notify other participants that messages were read
      client.to(`chat_${data.chatId}`).emit('messages_read', {
        chatId: data.chatId,
        userId: client.userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to mark messages as read', error);
      return { error: 'Failed to mark messages as read' };
    }
  }
}
