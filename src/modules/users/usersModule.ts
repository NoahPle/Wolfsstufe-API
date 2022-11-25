import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './usersController';
import { CoreModule } from '../../core/core.module';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [CoreModule],
})
export class UsersModule {}
