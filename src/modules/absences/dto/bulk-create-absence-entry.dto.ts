import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateAbsenceEntryDto } from './create-absence-entry.dto';
import { Type } from 'class-transformer';

export class BulkCreateAbsenceEntryDto {
    @IsString()
    absenceListId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAbsenceEntryDto)
    absenceEntries: CreateAbsenceEntryDto[];
}
