import { IsArray, IsDate, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
export class CreateMetaOptionDto {

    @IsNotEmpty()
    @IsJSON()
    metaValue: string;
}