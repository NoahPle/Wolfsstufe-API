import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRuleDto {
    @IsString()
    id: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsNumber()
    @IsOptional()
    index: number;
}
