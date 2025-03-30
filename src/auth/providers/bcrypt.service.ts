import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { HashingService } from './hashing.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptService implements HashingService {

  public async hashPassword(data: string | Buffer): Promise<string> {
    // Generate salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  public comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }

}
