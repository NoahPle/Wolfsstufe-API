import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { MembersService } from './members.service';
import { Logger } from '@nestjs/common';

@Processor({ name: 'midata' })
export class MidataProcessor {
    private logger = new Logger('MidataProcessor');

    constructor(private membersService: MembersService, @InjectQueue('midata') readonly midataQueue: Queue) {
        this.setupQueue(midataQueue).catch(console.log);
    }

    async setupQueue(midataQueue) {
        const jobs = await midataQueue.getRepeatableJobs();
        const promises = jobs.map((job) => midataQueue.removeRepeatableByKey(job.key));
        await Promise.all(promises);
        await midataQueue.add('sync', null, { repeat: { cron: '0 3 * * *' } });
    }

    @Process({ name: 'sync', concurrency: 1 })
    async sync(job: Job) {
        this.logger.verbose('Start syncing with Midata');
        const res = await this.membersService.syncWithMidata();
        this.logger.verbose(`${res.created.length} members created, ${res.updated.length} members updated`);
    }
}
