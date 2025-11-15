import { Pet } from 'src/pet/entities/pet.entity';
import { ReportType } from './report-type.entity';
import { User } from 'src/user/entities/user.entity';

export class Report {
  constructor(
    private readonly id: number,
    private readonly pet: Pet,
    private readonly type: ReportType,
    private readonly description: string,
    private readonly photoUrl: string | null,
    private readonly _lat: number,
    private readonly _long: number,
    private readonly resolved: boolean,
    private readonly reportedBy: User,
    private readonly reportedAt: Date,
    private readonly resolvedAt: Date | null,
  ) {}

  get lat(): number {
    return this._lat;
  }

  get long(): number {
    return this._long;
  }
}
