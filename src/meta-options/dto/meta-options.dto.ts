import { IsArray, IsDate, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
export class MetaOptionsDto {

    @IsString()
    @IsNotEmpty()
    key: string

    @IsNotEmpty()
    value: any
}