import { Module } from '@nestjs/common';
import { AbsencesModule } from './modules/absences/absences.module';

@Module({
  imports: [AbsencesModule],
})
export class AppModule {}
