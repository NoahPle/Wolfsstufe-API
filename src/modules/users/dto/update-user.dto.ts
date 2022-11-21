import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.model';

export class UpdateUserDto {
    @IsString()
    readonly id: string;

    @IsString()
    readonly pfadiname: string;

    @IsString()
    readonly firstname: string;

    @IsString()
    readonly lastname: string;

    @IsString()
    @IsOptional()
    readonly phone: string;

    @IsEnum(UserRole)
    readonly role: UserRole;
}
