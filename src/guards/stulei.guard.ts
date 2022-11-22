import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { FirestoreService } from '../core/firestore/firestore.service';
import { UserRole } from '../modules/users/user.model';

@Injectable()
export class StuleiGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const message: IncomingMessage = context.getArgs()[0];
        if (message.headers.authorization) {
            const token: string = message.headers.authorization.split('Bearer ')[1];
            const decodedIdToken = await FirestoreService.verifyIdToken(token);
            return decodedIdToken.role === UserRole.admin || decodedIdToken.role === UserRole.stulei;
        } else {
            return false;
        }
    }
}
