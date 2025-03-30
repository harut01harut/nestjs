import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenService } from 'src/auth/providers/generate-token.service';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
    private oauthClient: OAuth2Client;

    constructor(
        /**
         * Inject userService
         */
        private readonly generateTokenService: GenerateTokenService,
        /**
         * Inject userService
         */
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        /**
         * Inject jwtConfiguration
         */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ){}

    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientId;
        this.oauthClient = new OAuth2Client(clientId, clientSecret);
    }

    public async authantication(googleTokenDto: GoogleTokenDto) {
        
        try{
            // verify the google token sent by User
            const loginTicket = await this.oauthClient.verifyIdToken({
                idToken: googleTokenDto.token,
            });
            // Extract the payload from Google JWT
            const ticketPayload = loginTicket.getPayload();

            if(!ticketPayload){
                throw new UnauthorizedException()
            }

            const { 
                email,
                sub: googleId, 
                given_name: firstName,
                family_name: lastName,
            } = ticketPayload

            // Find the user in the database using the googleId
            let user = await this.usersService.findOneByGoogleId(googleId)
            
            if(user) {
                return this.generateTokenService.generateToken(user);
            } else {
            // If not create a new user with token

                if(email && lastName && firstName && googleId){
                    user = await this.usersService.createGoogleUser({
                        email,
                        firstName,
                        lastName,
                        googleId,
                    })   
                }
            }
            
            return this.generateTokenService.generateToken(user);
        }catch(error) {
            // throw Unauthotised exception
            throw new UnauthorizedException(error);
        }
        
    } 
}
