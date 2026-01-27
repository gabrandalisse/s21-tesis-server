import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/user/entities/user.entity';
import { ReportMatch } from './report-match.entity';

export class Report {
  constructor(
    private readonly id: number,
    private readonly pet: Pet,
    private readonly type: string,
    private readonly description: string,
    private readonly photoUrl: string | null,
    private readonly lat: number,
    private readonly long: number,
    private readonly resolved: boolean,
    private readonly reportedBy: User,
    private readonly reportedAt: Date,
    private readonly resolvedAt: Date | null,
    private readonly matches: ReportMatch[],
  ) {}

  public getId(): number {
    return this.id;
  }

  public getPet(): Pet {
    return this.pet;
  }

  public getType(): string {
    return this.type;
  }

  public getLat(): number {
    return this.lat;
  }

  public getLong(): number {
    return this.long;
  }

  public getReportedById(): number {
    return this.reportedBy.getId();
  }

  public getReportedBy(): User {
    return this.reportedBy;
  }

  public getResolved(): boolean {
    return this.resolved;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPhotoUrl(): string | null {
    return this.photoUrl;
  }

  public getReportedAt(): Date {
    return this.reportedAt;
  }

  public getResolvedAt(): Date | null {
    return this.resolvedAt;
  }

  public toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { matches, ...rest } = this;
    return {
      ...rest,
      reportedById: this.reportedBy.getId(),
    };
  }
}
