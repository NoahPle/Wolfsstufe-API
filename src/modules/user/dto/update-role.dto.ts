import { UserRole } from '../user.model';
import { IsEnum, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsString()
    readonly uid;

    @IsEnum(UserRole)
    readonly role: UserRole;
}
