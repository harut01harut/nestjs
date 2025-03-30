import { IsDate, IsOptional } from "class-validator";
import { IntersectionType } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

class GetPostBaseDto {
  
  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}


export class GetPostsDto extends IntersectionType(
  GetPostBaseDto,
  PaginationQueryDto,
){}