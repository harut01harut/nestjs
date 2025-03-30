import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-posts.dto';
import { UpdatePostDto } from './dtos/update-posts.dto';
import { GetPostsDto } from './dtos/get-posts-query.dto';
import { ActiveUser } from 'src/auth/decorator/acitve-user.decoretor';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { PostsMongoService } from './mongo-providers/posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly postsMongoService: PostsMongoService,
    ){}

    @Get('/{:userId}')
    public getPosts(
        @Param('userId') userId: string,
        @Query() postQuery: GetPostsDto
    ) {
        console.log(postQuery);

        return this.postsService.findAll(postQuery)
    }

    @Post('2')
    @Auth(AuthType.None)
    public async createPost2(
        @Body() createPostDto: CreatePostDto,
    ) {
        // console.log(user);
        return await this.postsMongoService.create(createPostDto);
    }

    @Post()
    public async createPost(
        @Body() createPostDto: CreatePostDto,
        @ActiveUser() user: ActiveUserData
    ) {
        console.log(user);
        return await this.postsService.create(createPostDto);
    }

    @Patch()
    public patchPost(
        @Body() updatePostDto: UpdatePostDto
    ) {
        return this.postsService.update(updatePostDto)
    }

    @Delete(':id')
    public deletePost(
        @Param('id', ParseIntPipe) postId: number
    ) {
        return this.postsService.delete(postId);
    }
}
