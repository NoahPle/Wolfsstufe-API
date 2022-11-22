import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { AdminConfigModel } from './admin-config.model';
import { EmailService } from '../../core/services/email.service';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AdminService extends ModelService {
    constructor(private http: HttpService) {
        super();
    }

    public async setMidataAccount(email: string, password: string) {
        const formData = new FormData();
        formData.append('person[email]', email);
        formData.append('person[password]', password);
        const account = await firstValueFrom(this.http.post('https://db.scout.ch/users/sign_in.json', formData)).catch(
            (e) => null,
        );

        if (account) {
            await this.setWithDto({ id: 'midata', email, password }, AdminConfigModel);
        }

        return { valid: !!account };
    }

    public async setEmailAccount(email: string, password: string) {
        if (await EmailService.checkAccountValid(email, password)) {
            await this.setWithDto({ id: 'email', email, password }, AdminConfigModel);
            return { valid: true };
        } else {
            return { valid: false };
        }
    }
}
