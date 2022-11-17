import { Module } from '@nestjs/common';
import { AbsencesModule } from './modules/absences/absences.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirestoreModule } from './core/firestore/firestore.module';
import { UserModule } from './modules/user/user.module';
import { MembersModule } from './modules/members/members.module';
import { MigrationsModule } from './modules/migrations/migrations.module';

@Module({
    imports: [AuthModule, FirestoreModule, UserModule, AbsencesModule, MembersModule, MigrationsModule],
})
export class AppModule {}
