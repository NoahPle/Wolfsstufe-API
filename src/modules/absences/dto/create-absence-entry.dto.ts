import { EntryType } from '../models/entry.model';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAbsenceEntryDto {
    @IsString()
    readonly id: string;

    @IsBoolean()
    @IsOptional()
    present?: boolean;

    @IsBoolean()
    @IsOptional()
    excused?: boolean;

    @IsEnum(EntryType)
    type: EntryType;
}
