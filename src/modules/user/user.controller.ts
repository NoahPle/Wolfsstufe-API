import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('create')
    @UseGuards(AdminGuard)
    private async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.userService.createUser(createUserDto);
    }

    @Put('role')
    @UseGuards(AdminGuard)
    private async updateRole(@Body() updateRoleDto: UpdateRoleDto): Promise<void> {
        await this.userService.updateRole(updateRoleDto);
    }
}
