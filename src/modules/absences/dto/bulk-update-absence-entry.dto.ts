import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAbsenceEntryDto } from './create-absence-entry.dto';

export class BulkUpdateAbsenceEntryDto {
    @IsString()
    id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAbsenceEntryDto)
    entries: CreateAbsenceEntryDto[];
}
