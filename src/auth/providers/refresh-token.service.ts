import { Injectable, forwardRef, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokenService } from './generate-token.service';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokenService {

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersSerivce: UsersService,
    private readonly generateTokenSerivce: GenerateTokenService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {


      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(
        refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      }
      )

      const user = await this.usersSerivce.findOneById(sub)

      // Generate new token
      return await this.generateTokenSerivce.generateToken(user);
    } catch(error) {
      throw new UnauthorizedException(error);
    }
  }

}
