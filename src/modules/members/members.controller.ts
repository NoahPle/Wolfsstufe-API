import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserGuard } from '../../guards/user-guard';
import { CreateMemberDto } from './dto/create-member-dto';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member-dto';
import { StuleiGuard } from '../../guards/stulei.guard';

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
    @UseGuards(StuleiGuard)
    async disableMember(@Param('id') id: string) {
        await this.membersService.disableMember(id);
    }

    @Post('sync')
    async syncWithMidata(): Promise<any> {
        return await this.membersService.syncWithMidata();
    }
}
