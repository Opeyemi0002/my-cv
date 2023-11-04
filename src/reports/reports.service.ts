import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { createReportDto } from './DTOs/create-report.dto';
import { User } from 'src/users/user.entity';
@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private reportRepo:Repository<Report>){}

    create(reportDto:createReportDto, user:User){
        const report = this.reportRepo.create(reportDto);
        report.user =user;

        return this.reportRepo.save(report);

    }


}
