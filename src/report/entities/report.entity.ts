import { Pet } from 'src/pet/entities/pet.entity';
import { ReportType } from './report-type.entity';
import { User } from 'src/user/entities/user.entity';
import { ReportMatch } from './report-match.entity';

export class Report {
  constructor(
    public readonly id: number,
    public readonly pet: Pet,
    public readonly type: ReportType,
    private readonly description: string,
    private readonly photoUrl: string | null,
    public readonly lat: number,
    public readonly long: number,
    private readonly resolved: boolean,
    private readonly reportedBy: User,
    private readonly reportedAt: Date,
    private readonly resolvedAt: Date | null,
    private readonly lostMatches: ReportMatch[],
    private readonly foundMatches: ReportMatch[],
  ) {}
}
