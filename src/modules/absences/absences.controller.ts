import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UserGuard } from '../../guards/user-guard';
import { BulkUpdateAbsenceEntryDto } from './dto/bulk-update-absence-entry.dto';

@Controller('absences')
@UseGuards(UserGuard)
export class AbsencesController {
    constructor(private absencesService: AbsencesService) {}

    @Post()
    async createAbsenceList(@Body() createAbsenceDto: CreateAbsenceDto): Promise<any> {
        return await this.absencesService.createAbsenceList(createAbsenceDto);
    }

    @Put()
    async updateEntries(@Body() bulkUpdateAbsenceEntryDto: BulkUpdateAbsenceEntryDto): Promise<any> {
        return await this.absencesService.updateEntries(bulkUpdateAbsenceEntryDto);
    }

    @Put('sync/:id')
    async syncEntries(@Param('id') id: string): Promise<any> {
        await this.absencesService.syncEntries(id);
    }

    @Delete(':id')
    async deleteList(@Param('id') id: string): Promise<any> {
        return await this.absencesService.deleteList(id);
    }
}
