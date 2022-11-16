import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user';

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

    @IsOptional()
    @IsEnum(UserRole, {
        message: 'role must be either user or admin',
    })
    readonly role: UserRole;
}
