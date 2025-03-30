import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserService } from './providers/create-users.service';
import jwtConfig from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User as _User, UserSchema} from './user.schema'; 
import { UsersMongoService } from './mongo-providers/users-mongo.service';
import { UsersMongoController } from './users-mongo.controller';

@Module({
  controllers: [UsersController, UsersMongoController],
  providers: [
    UsersMongoService,
    UsersService, 
    CreateUserService,
  ],
  exports: [UsersService, UsersMongoService],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{
      name: _User.name,
      schema: UserSchema,
    }]),
    TypeOrmModule.forFeature([User]),]
})
export class UsersModule {}
