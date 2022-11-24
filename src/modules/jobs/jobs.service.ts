import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './job.model';
import { UpdateJobUsersDto } from './dto/update-job-users.dto';

@Injectable()
export class JobsService extends ModelService {
    async createJob(createJobDto: CreateJobDto) {
        await this.addWithDto(createJobDto, Job);
    }

    async updateJobUsers(updateJobUsersDto: UpdateJobUsersDto) {
        await this.setWithDto(updateJobUsersDto, Job);
    }

    async deleteJob(id: string) {
        await this.delete(id, Job);
    }
}
