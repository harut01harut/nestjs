import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../user.entity";
import { ConfigService } from "@nestjs/config";
import { HashingService } from "src/auth/providers/hashing.service";
import { MailService } from "src/mail/provider/mail.service";

/**
 * Class to connected for user serivce
 */
@Injectable()
export class CreateUserService {

    constructor(
        /**
         * Inject usersRepository
         */
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => HashingService))
        private readonly hashingService: HashingService,
        private readonly mailService: MailService,
    ){}

    public async createUser(createUserDto: CreateUserDto) {
        // Check is user exists with some email
        let existingUser;
        
        try{ 
            existingUser = await this.userRepository.findOne({
                where: {
                    email: createUserDto.email
                }
            })  
        }catch(err) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                    description: 'Error connecting to the database',
                }
            )
        }      
        // Handle exception
        if(existingUser) {
            throw new BadRequestException('User already exist with this email');
        }

        createUserDto.password = await this.hashingService.hashPassword(createUserDto.password);
        // Create a new user
        let newUser = this.userRepository.create(createUserDto);
        newUser = await this.userRepository.save(newUser);
        
        try {
            await this.mailService.sendUserWelcome(newUser);
        }catch(error) {
            throw new RequestTimeoutException(error);
        } 

        return newUser;
    }
}