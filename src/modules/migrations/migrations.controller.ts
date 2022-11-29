import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('migrations')
@UseGuards(AdminGuard)
export class MigrationsController {
    constructor(private migrationsService: MigrationsService) {}

    @Get()
    async getMigrations(): Promise<any> {
        return this.migrationsService.migrationNames;
    }

    @Post('members')
    async moveParticipantsToMembers() {
        await this.migrationsService.moveParticipantsToMembers();
    }

    @Post('users')
    async moveLeadersToUsers() {
        await this.migrationsService.moveLeadersToUsers();
    }

    @Post('events')
    async moveDivisionEntriesToEvents() {
        await this.migrationsService.moveDivisionEntriesToEvents();
    }

    @Post('jobs')
    async updateJobUserIds() {
        await this.migrationsService.updateJobUserIds();
    }

    @Post('absences')
    async moveListsToAbsences() {
        await this.migrationsService.moveListsToAbsences();
    }
}
