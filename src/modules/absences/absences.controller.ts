import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UserGuard } from '../../guards/user-guard';
import { BulkCreateAbsenceEntryDto } from './dto/bulk-create-absence-entry.dto';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';

@Controller('absences')
@UseGuards(UserGuard)
export class AbsencesController {
    constructor(private absencesService: AbsencesService) {}

    @Post()
    async createAbsenceList(@Body() createAbsenceDto: CreateAbsenceDto): Promise<void> {
        return await this.absencesService.createAbsenceList(createAbsenceDto);
    }

    @Post('entries')
    async addEntries(@Body() bulkCreateAbsenceEntryDto: BulkCreateAbsenceEntryDto): Promise<void> {
        return await this.absencesService.addEntries(bulkCreateAbsenceEntryDto);
    }

    @Put('entries')
    async updateEntries(@Body() bulkUpdateAbsenceEntryDto: BulkUpdateAbsenceEntryDto): Promise<void> {
        return await this.updateEntries(bulkUpdateAbsenceEntryDto);
    }
}
