import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { CreateMemberDto } from './dto/create-member-dto';
import { Member } from './member.model';
import { UpdateMemberDto } from './dto/update-member-dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class MembersService extends ModelService {
    constructor(private http: HttpService) {
        super();
    }

    async createMember(createMemberDto: CreateMemberDto) {
        await this.addWithDto(createMemberDto, Member);
    }

    async updateMember(updateMemberDto: UpdateMemberDto) {
        await this.setWithDto(updateMemberDto, Member);
    }

    async deleteMember(id: string) {
        await this.delete(id, Member);
    }

    async bulkCreateMembers(createMemberDtos: CreateMemberDto[]) {
        await this.bulkAddWithDto(createMemberDtos, Member);
    }

    async syncWithMidata() {
        const formData = new FormData();
        formData.append('person[email]', 'pearl@sturmvogel.ch');
        formData.append('person[password]', 'IzgGTA5mR!MI');

        const account = await firstValueFrom(this.http.post('https://db.scout.ch/users/sign_in.json', formData));

        const config = {
            params: {
                user_email: 'pearl@sturmvogel.ch',
                user_token: account.data.people[0].authentication_token,
            },
        };

        const response = await firstValueFrom(this.http.get('https://db.scout.ch/groups/7837/people.json', config));

        const people = response.data.people;
        const models: Member[] = await Promise.all(
            people.map(async (person) => {
                const details = await firstValueFrom(this.http.get(person.href, config));
                const numbers: any[] = details.data.linked.phone_numbers;
                const labels: string[] = numbers.map((number) => number.label);
                const get = (label) => numbers.find((number) => number.label === label).number;
                let number = null;

                if (labels.includes('Mutter')) {
                    number = get('Mutter');
                } else if (labels.includes('Vater')) {
                    number = get('Vater');
                } else if (labels.includes('Mobil')) {
                    number = get('Mobil');
                } else if (labels.includes('Privat')) {
                    number = get('Privat');
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

        const members = await Member.queryAll();
        const storedMidataIds = members.map((member) => member.midataId);
        const oldModels = models.filter((model) => storedMidataIds.includes(model.midataId));
        const newModels = models.filter((model) => !storedMidataIds.includes(model.midataId));

        for (const model of oldModels) {
            model.id = members.find((member) => member.midataId === model.midataId).id;
        }

        for (const model of newModels) {
            const equalMember = members.find(
                (member) => member.firstname === model.firstname && member.lastname === model.lastname,
            );

            if (equalMember) {
                model.id = equalMember.id;
            }
        }

        const modelsWithId = newModels.filter((model) => !!model.id);
        const modelsWithoutId = newModels.filter((model) => !model.id);

        await this.bulkSet([...oldModels, ...modelsWithId]);
        await this.bulkAdd(modelsWithoutId);

        return {
            created: modelsWithoutId.map((model) => model.getJson()),
            updated: modelsWithId.map((model) => model.getJson()),
        };
    }
}
