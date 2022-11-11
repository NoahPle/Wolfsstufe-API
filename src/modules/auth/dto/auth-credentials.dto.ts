import { IsString } from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;
}
