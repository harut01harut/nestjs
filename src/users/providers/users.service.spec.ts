import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserService } from './create-users.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { create } from 'domain';

describe('UsersService', () => {
    let service: UsersService;

    const mockCreateUserProvider: Partial<CreateUserService> = {
        createUser: (createUserDto: CreateUserDto) => Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password  
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: CreateUserService,
                    useValue: mockCreateUserProvider
                },
                {
                    provide: DataSource,
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {}
                },
                {
                    provide: ConfigService,
                    useValue: {}
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });


    it('Service should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('createUser', () => {
        it('should be defined', () => {
            expect(service.createUser).toBeDefined();
        })

        it('should call createUser on CreateUserService', async () => {
            let user = await service.createUser({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@doe.com',
                password: 'password',
            })

            expect(user.firstName).toEqual('John');
        })
    })
});
