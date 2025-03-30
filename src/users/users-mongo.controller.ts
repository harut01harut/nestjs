import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    Param,
    Query,
    Body, 
    Headers,
    Ip,
    ParseIntPipe,
    DefaultValuePipe,
    ValidationPipe,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersMongoService } from './mongo-providers/users-mongo.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users-mongo')
@ApiTags('UsersMongo')
export class UsersMongoController {
    
    constructor(
        private readonly usersService: UsersMongoService,
    ) {}

    @Post()
    // @SetMetadata('authType', 'None')
    @UseInterceptors(ClassSerializerInterceptor)
    @Auth(AuthType.None)
    public createUser(
        @Body() createUserDto: CreateUserDto,
    ){
        return this.usersService.createUser(createUserDto);
    }
}
