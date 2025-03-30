import { BadRequestException, Body, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.schema';
import { CreatePostDto } from '../dtos/create-posts.dto';
import { UsersMongoService } from 'src/users/mongo-providers/users-mongo.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsMongoService {
    

    constructor(
        private readonly userService: UsersMongoService,
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>,

    ){}

    public async create(createPostDto: CreatePostDto){
        // const author = await this.userService.findById(createPostDto.authorId);

        // if(!author) {
        //     throw new NotFoundException('User not found');
        // }
        const newPost = new this.postModel(createPostDto);
        
        return await newPost.save();
        
    }

    // public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>>{
    //     // Users service
    //     // Find a user
    //     // const user = this.userService.findOneById(+userId);

    //     return await this.paginationProvider.paginateQuery({
    //         limit: postQuery.limit,
    //         page: postQuery.page,
    //     },
    //     this.postsRepository
    // ); 
    // }   

    // public async delete(id: number) {
    //     const post = await this.postsRepository.delete(id);

    //     // await this.postsRepository.delete({ id });

    //     // await this.metaOptionRepository.delete({ id })
  
    //     // const inversePost = await this.metaOptionRepository.find({
    //     //     where: {
    //     //         id: post?.metaOptions?.id
    //     //     },
    //     //     relations: {
    //     //         post: true
    //     //     }
    //     // })

    //     // console.log(inversePost);

    //     return { deleted: true, id };
    // }

    // public async update(updatePostDto: UpdatePostDto) {
        
    //     let tags;
    //     let post;
        
    //     try {

    //        tags = await this.tagsService.findMultipleTags(updatePostDto.tags as number[]);
    //     } catch(error) {
    //         throw new RequestTimeoutException(
    //             'Unable to process your request'
    //         )
    //     }

    //     if(updatePostDto.tags && tags.length !==  updatePostDto.tags.length ){
    //         throw new BadRequestException('Tags are not equal to the finded tags length');
    //     }

    //     try {
    //         post = await this.postsRepository.findOneBy({
    //             id: updatePostDto.id,
    //         });

    //     } catch(error) {
    //         throw new RequestTimeoutException(
    //             'Unable to process your request'
    //         )
    //     }

    //     if(!post) {
    //         throw new NotFoundException('Post not found');
    //     }
        
    //     post.title = updatePostDto.title ?? post.title;
    //     post.content = updatePostDto.content ?? post.content;
    //     post.status = updatePostDto.status ?? post.status;
    //     post.postType = updatePostDto.postType ?? post.postType;
    //     post.slug = updatePostDto.slug ?? post.slug;
    //     post.featuredImageUrl = updatePostDto.featuredImageUrl ?? post.featuredImageUrl;
    //     post.publishOn = updatePostDto.publishOn ?? post.publishOn;

    //     post.tags = tags;

    //     try {
    //         await this.postsRepository.save(post);
    //     } catch(error) {
    //         throw new RequestTimeoutException(
    //             'Unable to process your request'
    //         )
    //     }

    //     return post;
    // }
}
