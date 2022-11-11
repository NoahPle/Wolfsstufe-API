import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('create')
    private async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.userService.createUser(createUserDto);
    }

    @Put('role')
    private async updateRole(@Body() updateRoleDto: UpdateRoleDto): Promise<void> {
        await this.userService.updateRole(updateRoleDto);
    }
}
