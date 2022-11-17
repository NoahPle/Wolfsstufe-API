import { Controller, Post, UseGuards } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('migrations')
@UseGuards(AdminGuard)
export class MigrationsController {
    constructor(private migrationsService: MigrationsService) {}

    //Moves all entries of the participants collection to the members collection and sets custom ids
    @Post('members')
    async moveParticipantsToMembers() {
        await this.migrationsService.moveParticipantsToMembers();
    }
}
