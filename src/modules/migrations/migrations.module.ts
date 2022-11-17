import { Module } from '@nestjs/common';
import { MigrationsController } from './migrations.controller';
import { MigrationsService } from './migrations.service';
import { MembersModule } from '../members/members.module';

@Module({
    controllers: [MigrationsController],
    providers: [MigrationsService],
    imports: [MembersModule],
})
export class MigrationsModule {}
