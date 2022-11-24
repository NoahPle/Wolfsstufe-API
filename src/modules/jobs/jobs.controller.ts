import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StuleiGuard } from '../../guards/stulei.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';
import { UpdateJobUsersDto } from './dto/update-job-users.dto';

@Controller('jobs')
@UseGuards(StuleiGuard)
export class JobsController {
    constructor(private jobsService: JobsService) {}

    @Post()
    async createJob(@Body() createJobDto: CreateJobDto): Promise<any> {
        return await this.jobsService.createJob(createJobDto);
    }

    @Put()
    async updateJobUsers(@Body() updateJobUsersDto: UpdateJobUsersDto): Promise<any> {
        return await this.jobsService.updateJobUsers(updateJobUsersDto);
    }

    @Delete(':id')
    async deleteJob(@Param('id') id: string): Promise<any> {
        await this.jobsService.deleteJob(id);
    }
}
