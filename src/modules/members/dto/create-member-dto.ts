import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsOptional()
    pfadiname: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsNumber()
    @IsOptional()
    midataId: string;
}
