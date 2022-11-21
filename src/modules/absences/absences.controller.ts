import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UserGuard } from '../../guards/user-guard';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';

@Controller('absences')
@UseGuards(UserGuard)
export class AbsencesController {
    constructor(private absencesService: AbsencesService) {}

    @Post()
    async createAbsenceList(@Body() createAbsenceDto: CreateAbsenceDto): Promise<void> {
        return await this.absencesService.createAbsenceList(createAbsenceDto);
    }

    @Put('entries')
    async updateEntries(@Body() bulkUpdateAbsenceEntryDto: BulkUpdateAbsenceEntryDto): Promise<void> {
        return await this.absencesService.updateEntries(bulkUpdateAbsenceEntryDto);
    }

    @Get('sync')
    async getEmails(): Promise<any> {
        return await this.absencesService.setAbsencesWithEmails();
    }
}
