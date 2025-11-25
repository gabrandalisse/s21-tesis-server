import { Injectable, Logger } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { DatabaseService } from 'src/database/database.service';
import ReportMapper from '../mappers/report.mapper';
import { REPORT_FULL_RELATIONS } from 'src/constants/includes.constants';
import DistanceUtils from 'src/utils/distance.utils';
import { REPORT_MAX_DISTANCE_KM } from 'src/constants/distance.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  REPORT_CREATED_JOB_NAME,
  REPORT_QUEUE_NAME,
} from 'src/constants/queue.constants';
import { ReportTypeEnum } from 'src/enums/report.enums';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectQueue(REPORT_QUEUE_NAME) private readonly reportQueue: Queue,
    private readonly dbService: DatabaseService,
  ) {}

  public async create(createReportDto: CreateReportDto) {
    const result = await this.dbService.report.create({
      data: createReportDto,
      include: REPORT_FULL_RELATIONS,
    });

    const report = ReportMapper.toDomain(result);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (report.type.name.toLowerCase() === ReportTypeEnum.LOST)
      await this.reportQueue.add(REPORT_CREATED_JOB_NAME, { report });

    // TODO add a queue for notifications? -> Yes!

    return report;
  }

  public async findAllByLatAndLong(
    lat: number,
    long: number,
    options?: object,
  ) {
    this.logger.log(`Finding reports near lat: ${lat}, long: ${long}`);

    const dbResult = await this.dbService.report.findMany({
      include: REPORT_FULL_RELATIONS,
      where: { resolved: false, ...options },
    });

    this.logger.log(`Found ${dbResult.length} reports in DB`);

    const reports = ReportMapper.toDomainArray(dbResult);

    const filteredReports = reports.filter((report) => {
      const distanceKm = DistanceUtils.haversineDistance(
        lat,
        long,
        report.lat,
        report.long,
      );

      return distanceKm <= REPORT_MAX_DISTANCE_KM;
    });

    this.logger.log(
      `Filtered to ${filteredReports.length} reports within ${REPORT_MAX_DISTANCE_KM} km`,
    );

    return filteredReports;
  }

  public async findOne(id: number) {
    const report = await this.dbService.report.findUnique({
      where: { id },
      include: REPORT_FULL_RELATIONS,
    });

    if (!report) return null;
    else return ReportMapper.toDomain(report);
  }

  public async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.dbService.report.update({
      where: { id },
      data: updateReportDto,
      include: REPORT_FULL_RELATIONS,
    });

    return ReportMapper.toDomain(report);
  }

  public async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.dbService.report.delete({
      where: { id },
    });

    return { deleted: result !== null };
  }
}

// TODO el get devuelve esto, arreglar los _
[
  {
    id: 2,
    pet: {
      id: 2,
      user: {
        id: 1,
        email: 'andy003@gmail.com',
        name: 'Andres',
        password: 'andypass323554',
        lat: 124,
        long: 223,
        createdAt: '2025-11-19T23:35:16.443Z',
        devices: [
          {
            id: 1,
            token: 'Andasdadres',
            platform: 'ios',
            createdAt: '2025-11-12T21:35:05.114Z',
          },
        ],
      },
      name: 'MachoMen',
      type: {
        id: 1,
        name: 'Perro',
        createdAt: '2025-11-05T21:20:03.821Z',
      },
      breed: {
        id: 1,
        name: 'Pitbull',
        typeId: 1,
        createdAt: '2025-11-06T22:01:44.196Z',
      },
      color: {
        id: 1,
        name: 'Marron',
        createdAt: '2025-11-07T21:44:49.890Z',
      },
      size: {
        id: 1,
        name: 'Mediano',
        createdAt: '2025-11-05T20:33:18.141Z',
      },
      sex: {
        id: 1,
        name: 'Macho',
        createdAt: '2025-11-07T21:44:57.471Z',
      },
      age: 5,
      photoUrl: 'www.amazon.com',
      distinctiveCharacteristics: 'Lleva una camisa roja',
      createdAt: '2025-11-24T23:44:49.462Z',
      reports: [],
    },
    _type: {
      id: 1,
      _name: 'lost',
      createdAt: '2025-11-25T23:03:58.029Z',
    },
    description: 'lleva collar roj',
    photoUrl: 'dasdad',
    _lat: 124,
    _long: 223,
    resolved: false,
    reportedBy: {
      id: 1,
      email: 'andy003@gmail.com',
      name: 'Andres',
      password: 'andypass323554',
      lat: 124,
      long: 223,
      createdAt: '2025-11-19T23:35:16.443Z',
      devices: [
        {
          id: 1,
          token: 'Andasdadres',
          platform: 'ios',
          createdAt: '2025-11-12T21:35:05.114Z',
        },
      ],
    },
    reportedAt: '2025-11-25T23:05:30.567Z',
    resolvedAt: null,
    lostMatches: [],
    foundMatches: [],
  },
];
