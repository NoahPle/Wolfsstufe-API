import { AttendanceState } from '../models/entry.model';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAbsenceEntryDto {
    @IsString()
    readonly id: string;

    @IsOptional()
    @IsEnum(AttendanceState)
    state: AttendanceState;
}
