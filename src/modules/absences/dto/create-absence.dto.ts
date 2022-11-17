import { IsDate, IsOptional } from 'class-validator';

export class CreateAbsenceDto {
    @IsDate()
    @IsOptional()
    date: Date;
}
