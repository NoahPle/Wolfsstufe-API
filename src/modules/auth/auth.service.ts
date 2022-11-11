import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    public authenticate(authCredentialsDto: AuthCredentialsDto) {}

    public createUser(dto: CreateUserDto) {}
}
