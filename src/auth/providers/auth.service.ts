import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from '../dtos/create-auth.dto';
import { UpdateAuthDto } from '../dtos/update-auth.dto';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { GenerateTokenService } from './generate-token.service';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userSerivce: UsersService,
    private readonly hashService: HashingService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Verify the refresh token using jwtSerivce
    return this.refreshTokenService.refreshToken(refreshTokenDto);
  }

  public async signIn(signInDto: SignInDto) {
    const user = await this.userSerivce.findOneByEmail(signInDto.email);
    
    if(!user || !user.password) {
      throw new BadRequestException('Wrong creadentials');
    }

    const isPassowrdCurrect = await this.hashService.comparePassword(
      signInDto.password,
      user.password
    )

    if(!isPassowrdCurrect){
      throw new BadRequestException('Wrong creadentials');
    }

    return await this.generateTokenService.generateToken(user); 
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  public login(email: string, password: string, id: string){
    const user = this.userSerivce.findOneById(123);
    // login
    // token
    return 'sample_token'
  }

  public isAuth() {
    return true;
  }
}
