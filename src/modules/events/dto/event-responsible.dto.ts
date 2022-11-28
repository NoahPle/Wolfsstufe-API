import { IsArray, IsOptional, IsString } from 'class-validator';

export class EventResponsibleDto {
    @IsArray()
    ws: string[];

    @IsString()
    @IsOptional()
    bs: string;

    @IsString()
    @IsOptional()
    ps: string;

    @IsString()
    @IsOptional()
    sm: string;
}
