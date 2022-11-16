import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { FirestoreService } from '../core/firestore/firestore.service';
import { UserRole } from '../modules/user/user';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const message: IncomingMessage = context.getArgs()[0];
        if (message.headers.authorization) {
            const token: string = message.headers.authorization.split('Bearer ')[1];
            const decodedIdToken = await FirestoreService.verifyCustomToken(token);
            return decodedIdToken.role === UserRole.admin;
        } else {
            return false;
        }
    }
}
