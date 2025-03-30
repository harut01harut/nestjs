import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { HashingService } from './providers/hashing.service';
import { BcryptService } from './providers/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokenService } from './providers/generate-token.service';
import { RefreshTokenService } from './providers/refresh-token.service';
import { GoogleAuthController } from './social/google-auth.controller';
import { GoogleAuthService } from './social/providers/google-auth.service';

@Module({
  controllers: [AuthController, GoogleAuthController],
  providers: [
    AuthService, 
    {
      provide: HashingService,
      useClass: BcryptService
    },
    GenerateTokenService,
    RefreshTokenService,
    GoogleAuthService,
  ],
  exports:[AuthService,HashingService],
  imports:[
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ]
})
export class AuthModule {}
