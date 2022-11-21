import { Body, Headers, Controller, Post, Put, UseGuards, Delete, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { StuleiGuard } from '../../guards/stulei.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('users')
@UseGuards(StuleiGuard)
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    private async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.userService.createUser(createUserDto);
    }

    @Put()
    private async updateUser(@Body() updateUserDto: UpdateUserDto, @Headers('Authorization') token: string) {
        await this.userService.updateUser(updateUserDto, token.split('Bearer ')[1]);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    private async disableUser(@Param('id') id: string) {
        await this.userService.disableUser(id);
    }
}
