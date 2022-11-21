import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { AbsenceList } from './models/absence-list.model';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { AbsenceEntry, AttendanceState } from './models/entry.model';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';
import * as moment from 'moment';
import { Member } from '../members/member.model';
import { EmailService } from '../../core/services/email.service';

@Injectable()
export class AbsencesService extends ModelService {
    async createAbsenceList(createAbsenceDto: CreateAbsenceDto) {
        if (!createAbsenceDto.date) {
            createAbsenceDto.date = moment().startOf('day').toDate();
        }

        return await this.addWithDto(createAbsenceDto, AbsenceList);
    }

    async updateEntries(dto: BulkUpdateAbsenceEntryDto) {
        await this.bulkSetWithDto(dto.absenceEntries, AbsenceEntry, dto.absenceListId);
    }

    async setAbsencesWithEmails() {
        const mails = await EmailService.fetchEmails();
        const recentMails = mails.filter((mail) => {
            const dateStrings = mail.header?.date || mail.header?.undefineddate;
            return dateStrings.length ? moment(dateStrings[0]).isAfter(moment().startOf('week')) : false;
        });

        const members: Member[] = await Member.queryAll();
        const results = [];

        for (const mail of recentMails) {
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
            const nextSaturday =
                moment().isoWeekday() <= 6 ? moment().isoWeekday(6) : moment().add(1, 'weeks').isoWeekday(6);

            const listId =
                (await AbsenceList.findByDate(nextSaturday)).id ||
                (await this.createAbsenceList({ date: nextSaturday.toDate() }));

            const dto: BulkUpdateAbsenceEntryDto = {
                absenceListId: listId,
                absenceEntries: filteredResults.map((member) => {
                    return { id: member.id, state: AttendanceState.excused };
                }),
            };

            await this.updateEntries(dto);
        }

        return filteredResults;
    }
}
