import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserGuard } from '../../guards/user-guard';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RulesService } from './rules.service';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('rules')
@UseGuards(UserGuard)
export class RulesController {
    constructor(private rulesService: RulesService) {}

    @Post()
    async createRule(@Body() createRuleDto: CreateRuleDto): Promise<any> {
        return await this.rulesService.createRule(createRuleDto);
    }

    @Put()
    async updateRule(@Body() updateRuleDto: UpdateRuleDto): Promise<any> {
        return await this.rulesService.updateRule(updateRuleDto);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id: string): Promise<any> {
        return await this.rulesService.deleteRule(id);
    }
}
