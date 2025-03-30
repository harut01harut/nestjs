import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserService } from './create-users.service';
import { ConfigService } from '@nestjs/config';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { create } from 'domain';
import { HashingService } from 'src/auth/providers/hashing.service';
import { MailService } from 'src/mail/provider/mail.service';
import { first } from 'rxjs';
import { UserRefreshClient } from 'google-auth-library';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral = any> (): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
})

describe('CreateUsersService', () => {

    let service: CreateUserService;
    let usersRepository: MockRepository;
    
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'password',
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {
                    provide: DataSource,
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository()
                },
                {
                    provide: HashingService,
                    useValue: {
                        hashPassword: jest.fn(() => user.password),
                    }
                },
                {
                    provide: MailService,
                    useValue: {
                        sendUserWelcome: jest.fn(() => Promise.resolve())
                    }
                }
            ]
        }).compile();
        
        service = module.get<CreateUserService>(CreateUserService);
        
        usersRepository = module.get(getRepositoryToken(User));
    });


    it('Service should be defined', () => {
       expect(service).toBeDefined();
    })

    describe('createUser', () => {
        describe('When user does not exist in database', () => {
            it('should create a new user', async () => {
                usersRepository.findOne?.mockReturnValue(null);
                usersRepository.create?.mockReturnValue(user);
                usersRepository.save?.mockReturnValue(user);
            
                const newUser = await service.createUser(user);

                expect(usersRepository.findOne).toHaveBeenCalledWith({
                    where: { email: user.email },
                });

                expect(usersRepository.create).toHaveBeenCalledWith(user);
                expect(usersRepository.save).toHaveBeenCalledWith(user);
            })
        });

        describe('When user exist', () => {
            it('should throw BadRequestException ', async () => {
                usersRepository.findOne?.mockReturnValue(user.email);
                usersRepository.create?.mockReturnValue(user);
                usersRepository.save?.mockReturnValue(user);
            
                try {
                    const newUser = await service.createUser(user);
                }catch(error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                }
            })
        })
    })
});
