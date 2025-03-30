import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateAuthDto } from '../dtos/create-auth.dto';
import { UpdateAuthDto } from '../dtos/update-auth.dto';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export abstract class HashingService {

  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    data: string| Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
