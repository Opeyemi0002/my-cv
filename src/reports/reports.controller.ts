import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { createReportDto } from './DTOs/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/users/guards/authguard';
import { currentUser } from 'src/users/Decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
@Controller('reports')
export class ReportsController {
    constructor(private reportservice:ReportsService){}
    @Post('/create-report')
    @UseGuards(AuthGuard)
    async createReport(@Body() body:createReportDto, @currentUser() user:User){
      return await this.reportservice.create(body, user) ; 
    }
}
