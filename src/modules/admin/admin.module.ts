import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [AdminController],
    providers: [AdminService],
    imports: [HttpModule],
})
export class AdminModule {}
