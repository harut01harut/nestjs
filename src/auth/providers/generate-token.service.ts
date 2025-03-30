import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/users/user.entity';

@Injectable()
export class GenerateTokenService {

  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  public async signInToken<T>(
    userId: number, 
    expiresIn: number,
    payload?: T
  ) {

    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      ...payload,
    },
    {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn,
    });
    

    return accessToken
  }

  public async generateToken(user){
    // Generate access token
    const [
      accessToken,
      refreshToken
    ] = await Promise.all([
      this.signInToken(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email
      }),
      this.signInToken(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
      )
    ]);

    return {
      accessToken,
      refreshToken
    }
  }
}
