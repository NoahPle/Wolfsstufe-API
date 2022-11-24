import { IsArray, IsString } from 'class-validator';

export class CreateJobDto {
    @IsString()
    name: string;

    @IsArray()
    userIds: string[];
}
