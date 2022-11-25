import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { Rule } from './rule.model';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService extends ModelService {
    async createRule(createRuleDto: CreateRuleDto) {
        const rules = await Rule.queryAll();
        await this.addWithDto({ ...createRuleDto, index: rules.length }, Rule);
    }

    async updateRule(updateRuleDto: UpdateRuleDto) {
        await this.setWithDto(updateRuleDto, Rule);
    }

    async deleteRule(id: string) {
        await this.delete(id, Rule);
    }
}
