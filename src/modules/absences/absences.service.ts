import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { AbsenceList } from './models/absence-list.model';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { AbsenceEntry } from './models/entry.model';
import { BulkCreateAbsenceEntryDto } from './dto/bulk-create-absence-entry.dto';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';

@Injectable()
export class AbsencesService extends ModelService {
    async createAbsenceList(createAbsenceDto: CreateAbsenceDto) {
        if (!createAbsenceDto.date) {
            createAbsenceDto.date = new Date();
        }

        await this.addWithDto(createAbsenceDto, AbsenceList);
    }

    async addEntries(dto: BulkCreateAbsenceEntryDto) {
        //add all leaders and participants that are not set and not in dto

        await this.bulkSetWithDto(dto.absenceEntries, AbsenceEntry, dto.absenceListId);
    }

    async updateEntries(dto: BulkUpdateAbsenceEntryDto) {
        await this.bulkSetWithDto(dto.absenceEntries, AbsenceEntry, dto.absenceListId);
    }
}
