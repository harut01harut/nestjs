import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(96)
    lastName?: string;
    
    @IsString()
    @IsNotEmpty()
    email: string;

    // @Matches('') // this is will be good using custom message
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
