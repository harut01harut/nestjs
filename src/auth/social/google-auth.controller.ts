import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './providers/google-auth.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-auth')
export class GoogleAuthController {
    constructor(
        /**
         * Inject google authantication
         */
        private readonly googleAuthServcie: GoogleAuthService,
    ){}

    @Post()
    public auth(
        @Body() googleTokenDto: GoogleTokenDto 
    ){
        return this.googleAuthServcie.authantication(googleTokenDto)
    }
}
