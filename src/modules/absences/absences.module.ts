import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';

@Module({
  providers: [AbsencesService],
  controllers: [AbsencesController],
})
export class AbsencesModule {}
