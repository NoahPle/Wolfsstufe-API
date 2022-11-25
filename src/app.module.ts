import { Module } from '@nestjs/common';
import { AbsencesModule } from './modules/absences/absences.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirestoreModule } from './core/firestore/firestore.module';
import { UsersModule } from './modules/users/usersModule';
import { MembersModule } from './modules/members/members.module';
import { MigrationsModule } from './modules/migrations/migrations.module';
import { BullModule } from '@nestjs/bull';
import { AdminModule } from './modules/admin/admin.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { CoreModule } from './core/core.module';
import { RulesModule } from './modules/rules/rules.module';

@Module({
    imports: [
        AuthModule,
        FirestoreModule,
        UsersModule,
        AbsencesModule,
        MembersModule,
        MigrationsModule,
        AdminModule,
        JobsModule,
        CoreModule,
        RulesModule,
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
})
export class AppModule {}
