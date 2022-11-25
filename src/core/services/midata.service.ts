import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminConfigModel } from '../../modules/admin/admin-config.model';
import * as FormData from 'form-data';
import { CypherService } from './cypher.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MidataService {
    constructor(private http: HttpService) {}

    public async getCredentials() {
        const account = await AdminConfigModel.queryById('midata');

        if (!account) {
            throw new HttpException('Account not set', HttpStatus.FAILED_DEPENDENCY);
        }

        const formData = new FormData();
        formData.append('person[email]', account.email);
        formData.append('person[password]', CypherService.decrypt(account.password));

        const credentials = await firstValueFrom(this.http.post('https://db.scout.ch/users/sign_in.json', formData));

        return {
            params: {
                user_email: account.email,
                user_token: credentials.data.people[0].authentication_token,
            },
        };
    }

    public async getGroup(groupId: string, credentials: any) {
        const response = await firstValueFrom(
            this.http.get(`https://db.scout.ch/groups/${groupId}/people.json`, credentials),
        );

        return response.data.people;
    }

    public async getPhoneNumbers(personHref: string, credentials: any): Promise<object> {
        const details = await firstValueFrom(this.http.get(personHref, credentials));
        const numbers = details.data.linked.phone_numbers;
        const object = {};

        for (const number of numbers) {
            object[number.label] = number.number;
        }

        return object;
    }
}
