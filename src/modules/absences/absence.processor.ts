import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { AbsencesService } from './absences.service';

@Processor({ name: 'absences' })
export class AbsenceProcessor {
    private logger = new Logger('MidataProcessor');

    constructor(private absencesService: AbsencesService, @InjectQueue('absences') readonly midataQueue: Queue) {
        this.setupQueue(midataQueue).catch(console.log);
    }

    async setupQueue(midataQueue) {
        const jobs = await midataQueue.getRepeatableJobs();
        const promises = jobs.map((job) => midataQueue.removeRepeatableByKey(job.key));
        await Promise.all(promises);
        await midataQueue.add('sync', null, { repeat: { cron: '0 22 * * 5' } });
    }

    @Process({ name: 'sync', concurrency: 1 })
    async sync(job: Job) {
        this.logger.verbose('Start syncing with Emails');
        const res = await this.absencesService.setAbsencesWithEmails();
        this.logger.verbose(`${res.length} absences set`);
    }
}
