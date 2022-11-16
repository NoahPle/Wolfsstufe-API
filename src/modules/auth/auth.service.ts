import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { FirestoreService } from '../../core/firestore/firestore.service';

@Injectable()
export class AuthService {
    public async authenticate(authCredentialsDto: AuthCredentialsDto) {
        return await FirestoreService.authenticateWithEmailAndPassword(
            authCredentialsDto.email,
            authCredentialsDto.password,
        );
    }
}
