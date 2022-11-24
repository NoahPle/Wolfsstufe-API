import { IsArray, IsString } from 'class-validator';

export class UpdateJobUsersDto {
    @IsString()
    id: string;

    @IsArray()
    userIds: string[];
}
