import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StuleiGuard } from '../../guards/stulei.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(StuleiGuard)
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    private async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.userService.createUser(createUserDto);
    }

    @Put()
    private async updateUser(@Body() updateUserDto: UpdateUserDto) {
        await this.userService.updateUser(updateUserDto);
    }

    @Put('role')
    private async updateRole(@Body() updateRoleDto: UpdateRoleDto): Promise<void> {
        await this.userService.updateRole(updateRoleDto);
    }

    @Put('admin/:id')
    @UseGuards(AdminGuard)
    private async makeAdmin(@Param('id') id: string): Promise<void> {
        await this.userService.makeAdmin(id);
    }
}
