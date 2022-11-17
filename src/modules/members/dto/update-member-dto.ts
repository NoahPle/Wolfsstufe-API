import { CreateMemberDto } from './create-member-dto';
import { IsString } from 'class-validator';

export class UpdateMemberDto extends CreateMemberDto {
    @IsString()
    id: string;
}
