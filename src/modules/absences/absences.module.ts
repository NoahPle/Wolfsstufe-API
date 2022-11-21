import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { AbsenceProcessor } from './absence.processor';
import { BullModule } from '@nestjs/bull';

@Module({
    providers: [AbsencesService, AbsenceProcessor],
    controllers: [AbsencesController],
    exports: [AbsencesService],
    imports: [BullModule.registerQueue({ name: 'absences' })],
})
export class AbsencesModule {}
