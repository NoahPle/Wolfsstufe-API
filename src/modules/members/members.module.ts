import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { BullModule } from '@nestjs/bull';
import { MidataProcessor } from './midata.processor';
import { CoreModule } from '../../core/core.module';

@Module({
    providers: [MembersService, MidataProcessor],
    controllers: [MembersController],
    exports: [MembersService],
    imports: [BullModule.registerQueue({ name: 'midata' }), CoreModule],
})
export class MembersModule {}
