import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { CreateMemberDto } from './dto/create-member-dto';
import { Member } from './member.model';
import { UpdateMemberDto } from './dto/update-member-dto';
import { MidataService } from '../../core/services/midata.service';

@Injectable()
export class MembersService extends ModelService {
    constructor(private midataService: MidataService) {
        super();
    }

    async createMember(createMemberDto: CreateMemberDto) {
        await this.addWithDto(createMemberDto, Member);
    }

    async updateMember(updateMemberDto: UpdateMemberDto) {
        await this.setWithDto(updateMemberDto, Member);
    }

    async disableMember(id: string) {
        await this.setWithDto({ id, disabled: true }, Member);
    }

    async bulkCreateMembers(createMemberDtos: CreateMemberDto[]) {
        await this.bulkAddWithDto(createMemberDtos, Member);
    }

    async syncWithMidata() {
        const credentials = await this.midataService.getCredentials();
        const people = await this.midataService.getGroup('7837', credentials);

        const models: Member[] = await Promise.all(
            people.map(async (person) => {
                const numbers = await this.midataService.getPhoneNumbers(person.href, credentials);
                let number = null;

                if (numbers['Mutter']) {
                    number = numbers['Mutter'];
                } else if (numbers['Vater']) {
                    number = numbers['Vater'];
                } else if (numbers['Mobil']) {
                    number = numbers['Mobil'];
                } else if (numbers['Privat']) {
                    number = numbers['Privat'];
                }

                const model = new Member();
                model.setFields({
                    firstname: person.first_name,
                    lastname: person.last_name,
                    pfadiname: person.nickname,
                    phone: number,
                    midataId: person.id,
                });

                return model;
            }),
        );

        const members = await Member.queryAll(true);
        const storedMidataIds = members.filter((member) => member.midataId).map((member) => member.midataId);
        const filteredModels = models.filter((model) => !storedMidataIds.includes(model.midataId));

        const existingModels = [];
        const newModels = [];

        for (const model of filteredModels) {
            const equalMember = members.find(
                (member) => member.firstname === model.firstname && member.lastname === model.lastname,
            );

            if (equalMember) {
                model.id = equalMember.id;
                existingModels.push(model);
            } else {
                newModels.push(model);
            }
        }

        await this.bulkSet(existingModels);
        await this.bulkAdd(newModels);

        return {
            created: newModels.map((model) => model.getJson()),
            updated: existingModels.map((model) => model.getJson()),
        };
    }
}
