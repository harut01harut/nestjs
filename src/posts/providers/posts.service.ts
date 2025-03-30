import { BadRequestException, Body, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { DeepPartial, Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from '../dtos/create-posts.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { UpdatePostDto } from '../dtos/update-posts.dto';
import { GetPostsDto } from '../dtos/get-posts-query.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
    

    constructor(
        private readonly tagsService: TagsService,
        private readonly userService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>,
        private readonly paginationProvider: PaginationProvider,
    ){}

    public async create(createPostDto: CreatePostDto){
        const author = await this.userService.findOneById(+createPostDto.author);

        if(!author) {
            throw new NotFoundException('User not found');
        }

        const tags =  await this.tagsService.findMultipleTags(createPostDto.tags as number[]);   

        let post = this.postsRepository.create(
            {
                ...createPostDto,
                author: author,
                tags,
            } as DeepPartial<Post>
        );
    
        return await this.postsRepository.save(post);
    }

    public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>>{
        // Users service
        // Find a user
        // const user = this.userService.findOneById(+userId);

        return await this.paginationProvider.paginateQuery({
            limit: postQuery.limit,
            page: postQuery.page,
        },
        this.postsRepository
    ); 
    }   

    public async delete(id: number) {
        const post = await this.postsRepository.delete(id);

        // await this.postsRepository.delete({ id });

        // await this.metaOptionRepository.delete({ id })
  
        // const inversePost = await this.metaOptionRepository.find({
        //     where: {
        //         id: post?.metaOptions?.id
        //     },
        //     relations: {
        //         post: true
        //     }
        // })

        // console.log(inversePost);

        return { deleted: true, id };
    }

    public async update(updatePostDto: UpdatePostDto) {
        
        let tags;
        let post;
        
        try {

           tags = await this.tagsService.findMultipleTags(updatePostDto.tags as number[]);
        } catch(error) {
            throw new RequestTimeoutException(
                'Unable to process your request'
            )
        }

        if(updatePostDto.tags && tags.length !==  updatePostDto.tags.length ){
            throw new BadRequestException('Tags are not equal to the finded tags length');
        }

        try {
            post = await this.postsRepository.findOneBy({
                id: updatePostDto.id,
            });

        } catch(error) {
            throw new RequestTimeoutException(
                'Unable to process your request'
            )
        }

        if(!post) {
            throw new NotFoundException('Post not found');
        }
        
        post.title = updatePostDto.title ?? post.title;
        post.content = updatePostDto.content ?? post.content;
        post.status = updatePostDto.status ?? post.status;
        post.postType = updatePostDto.postType ?? post.postType;
        post.slug = updatePostDto.slug ?? post.slug;
        post.featuredImageUrl = updatePostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishOn = updatePostDto.publishOn ?? post.publishOn;

        post.tags = tags;

        try {
            await this.postsRepository.save(post);
        } catch(error) {
            throw new RequestTimeoutException(
                'Unable to process your request'
            )
        }

        return post;
    }
}
