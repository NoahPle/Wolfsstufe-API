import { IsDateString } from 'class-validator';

export class CreateAbsenceDto {
    @IsDateString()
    date: Date;
}
