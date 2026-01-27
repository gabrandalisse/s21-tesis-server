export class Chat {
  constructor(
    private id: number,
    private reportId: number,
    private participantIds: number[],
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): number {
    return this.id;
  }

  getReportId(): number {
    return this.reportId;
  }

  getParticipantIds(): number[] {
    return this.participantIds;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
