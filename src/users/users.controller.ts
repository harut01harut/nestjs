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
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('/{:id}')
    @ApiOperation({
        summary: 'awdawdawd'
    })
    @ApiResponse({
        status: 200,
        description: 'awdawdawd'
    })
    @ApiQuery({
        name: 'limit',
        type: 'numberr',
        required: false,
        description: 'awdawd',
        example: 2
    }) 
    @ApiQuery({
        name: 'page',
        type: 'numberr',
        required: false,
        description: 'awdawd',
        example: 2
    }) 
    public getUsers(
        @Param() getUserParamDto: GetUsersParamDto,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        // @Query() query: any,
    ){
        return this.usersService.findAll(
            getUserParamDto,
            limit,
            page,
        )
    }

    @Post()
    // @SetMetadata('authType', 'None')
    @UseInterceptors(ClassSerializerInterceptor)
    @Auth(AuthType.None)
    public createUser(
        @Body() createUserDto: CreateUserDto,
    ){
        return this.usersService.createUser(createUserDto);
    }

    @Post('many')
    public createMany(
        @Body() createMany: CreateManyUsersDto,
    ){
        return this.usersService.createMany(createMany.manyUsers);
    }

    @Patch()
    public patchUser(
        @Body() patchUserDto: PatchUserDto,
    ){
        
        return patchUserDto;
    }
}
