import { BadRequestException, ConflictException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../user.entity";
import { ConfigService } from "@nestjs/config";
import { CreateUserService } from "./create-users.service";
import { GoogleUser } from "../interfaces/google-user.interface";

/**
 * Class to connected for user serivce
 */
@Injectable()
export class UsersService {

    constructor(
        /**
         * Inject usersRepository
         */
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
        private readonly createUserService: CreateUserService,
    ){}

    public createUser(createUserDto: CreateUserDto) {
        // Check is user exists with some email
        return this.createUserService.createUser(createUserDto)
    }


    public async createGoogleUser(googleUser: GoogleUser) {
        
        try {
            const user = this.userRepository.create(googleUser);
            
            return await this.userRepository.save(user);
        }catch(error) {
            throw new ConflictException(error, {
                description: 'Could not create a new user',
            })
        }
    }

    /**
     * Find all filtered users 
     */
    public findAll( 
        getUserParamDto: GetUsersParamDto,
        limit: number,
        page: number,
    ) {

        throw new HttpException(
            'string', 
            HttpStatus.MOVED_PERMANENTLY,
             {

        })
        console.log(this.configService.get('S3_BUCKET'));
        
        return [
            {
                firstName: 'John',
                email: 'john@doe.com'
            },
            {
                firstName: 'Alice',
                email: 'alice@doe.com'
            }
        ]
    }

    /**
     * Find one user by using user id
     */
    public async findOneByGoogleId(googleId: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({googleId})

        return user;
    }
    
    /**
     * Find one user by using user id
     */
    public async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({id})

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public async findOneByEmail(email: string) {
        return await this.userRepository.findOneBy({email})
    }

    public async createMany(createUsersDto: CreateUserDto[]) {
        let newUsers: User[] = [];
        
        // Create query runnes instanve
        const queryRunnes = this.dataSource.createQueryRunner();
        
        // Connect query runner to datasource
        await queryRunnes.connect();

        // Start transaction
        await queryRunnes.startTransaction();

        try{
            for(let user of createUsersDto) {
                let newUser = queryRunnes.manager.create(User, user);
                let result = await queryRunnes.manager.save(newUser);
                newUsers.push(result);
            }
            
            // If successful commit
            await queryRunnes.commitTransaction();
        }catch(err) {
            // If unsucessful rollback
            await queryRunnes.rollbackTransaction();
        }finally{
            // Release connection
            await queryRunnes.release();   
        }
    }

}