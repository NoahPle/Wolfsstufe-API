import { IsString } from 'class-validator';

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
    readonly phone: string;
}
