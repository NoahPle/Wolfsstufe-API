import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAbsenceEntryDto } from './update-absence-entry.dto';

export class BulkUpdateAbsenceEntryDto {
    @IsString()
    absenceListId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAbsenceEntryDto)
    absenceEntries: UpdateAbsenceEntryDto[];
}
