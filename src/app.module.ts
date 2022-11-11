import { Module } from '@nestjs/common';
import { AbsencesModule } from './modules/absences/absences.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, AbsencesModule],
})
export class AppModule {}
