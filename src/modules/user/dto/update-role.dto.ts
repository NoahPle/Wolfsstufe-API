import { UserRole } from '../user';
import { IsEnum, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsString()
    readonly uid;

    @IsEnum(UserRole)
    readonly role: UserRole;
}
