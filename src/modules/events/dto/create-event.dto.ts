import { IsDateString, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Department } from '../event.model';
import { EventResponsibleDto } from './event-responsible.dto';
import { Type } from 'class-transformer';

export class CreateEventDto {
    @IsString()
    name: string;

    @IsDateString()
    start: Date;

    @IsDateString()
    end: Date;

    @IsString()
    @IsOptional()
    motto: string;

    @IsEnum(Department)
    department: Department;

    @IsString()
    city: string;

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => EventResponsibleDto)
    responsible: EventResponsibleDto;
}
