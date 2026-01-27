export class Message {
  constructor(
    private id: number,
    private chatId: number,
    private senderId: number,
    private content: string,
    private createdAt: Date,
    private read: boolean = false,
  ) {}

  getId(): number {
    return this.id;
  }

  getChatId(): number {
    return this.chatId;
  }

  getSenderId(): number {
    return this.senderId;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  isRead(): boolean {
    return this.read;
  }

  markAsRead(): void {
    this.read = true;
  }
}