import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.model';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly pfadiname: string;

    @IsString()
    readonly firstname: string;

    @IsString()
    readonly lastname: string;

    @IsString()
    readonly phone: string;

    @IsEnum(UserRole)
    readonly role: UserRole;
}
