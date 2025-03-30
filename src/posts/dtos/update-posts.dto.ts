// For Documenation refer url: https://docs.nestjs.com/openapi/types-and-parameters
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { MetaOptionsDto } from '../../meta-options/dto/meta-options.dto';
import { PostType } from '../enum/post-type.enum';
import { PostStatus } from '../enum/post-status.enum';
import { CreatePostDto } from './create-posts.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number
}