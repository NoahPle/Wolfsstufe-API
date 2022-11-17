import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [MembersService],
    controllers: [MembersController],
    exports: [MembersService],
    imports: [HttpModule],
})
export class MembersModule {}
