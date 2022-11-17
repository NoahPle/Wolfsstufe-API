import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserGuard } from '../../guards/user-guard';
import { CreateMemberDto } from './dto/create-member-dto';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member-dto';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('members')
@UseGuards(UserGuard)
export class MembersController {
    constructor(private membersService: MembersService) {}

    @Post()
    async createMember(@Body() createMemberDto: CreateMemberDto): Promise<void> {
        await this.membersService.createMember(createMemberDto);
    }

    @Put()
    async updateMember(@Body() updateMemberDto: UpdateMemberDto) {
        await this.membersService.updateMember(updateMemberDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async deleteMember(@Param('id') id: string) {
        await this.membersService.deleteMember(id);
    }

    @Post('sync')
    async syncWithMidata(): Promise<any> {
        return await this.membersService.syncWithMidata();
    }
}
