import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { MidataProcessor } from './midata.processor';

@Module({
    providers: [MembersService, MidataProcessor],
    controllers: [MembersController],
    exports: [MembersService],
    imports: [HttpModule, BullModule.registerQueue({ name: 'midata' })],
})
export class MembersModule {}
