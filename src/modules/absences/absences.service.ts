import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { AbsenceList } from './models/absence-list.model';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { AbsenceEntry, EntryType } from './models/entry.model';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';
import * as moment from 'moment';
import { Member } from '../members/member.model';
import { EmailService } from '../../core/services/email.service';

@Injectable()
export class AbsencesService extends ModelService {
    async createAbsenceList(createAbsenceDto: CreateAbsenceDto) {
        createAbsenceDto.date = moment(createAbsenceDto.date).startOf('day').toDate();
        let list = await AbsenceList.findByDate(moment(createAbsenceDto.date));

        if (!list) {
            list = await AbsenceList.queryById(await this.addWithDto(createAbsenceDto, AbsenceList));
        }

        await this.setAbsencesWithEmails(list);
    }

    async updateEntries(dto: BulkUpdateAbsenceEntryDto) {
        await this.bulkSetWithDto(dto.entries, AbsenceEntry, dto.id);
    }

    async syncEntries(id: string) {
        const list = await AbsenceList.queryById(id);
        if (list) await this.setAbsencesWithEmails(list);
    }

    async setAbsencesWithEmails(list: AbsenceList) {
        const mails = await EmailService.fetchEmails(moment(list.date).startOf('week'));

        const members: Member[] = await Member.queryAll();
        const results = [];

        for (const mail of mails) {
            const subject: string[] = mail.header?.undefinedsubject || mail.header?.subject;

            if (subject.length) {
                let name = subject[0].split('Pfadiprogrammabmeldung ')[1].toLowerCase();

                if (name.includes('v/o')) {
                    name = name.split('v/o')[1].trim();
                }

                results.push(
                    ...members.filter((member) => !!member.pfadiname && name.includes(member.pfadiname.toLowerCase())),
                );
                results.push(
                    ...members.filter(
                        (member) =>
                            name.includes(member.firstname.toLowerCase()) &&
                            name.includes(member.lastname.toLowerCase()),
                    ),
                );
            }
        }

        const filteredResults: Member[] = [...new Set(results)];

        if (filteredResults.length) {
            const dto: BulkUpdateAbsenceEntryDto = {
                id: list.id,
                entries: filteredResults.map((member) => {
                    return { id: member.id, excused: true, type: EntryType.member };
                }),
            };

            await this.updateEntries(dto);
        }

        return filteredResults;
    }
}
