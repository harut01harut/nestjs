import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
    ValidateNested,
    IsArray,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export class CreateManyUsersDto {

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateUserDto)
    manyUsers: CreateUserDto[]
}
