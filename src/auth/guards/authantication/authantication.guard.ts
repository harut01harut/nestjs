import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthanticationGuard implements CanActivate {

  private static readonly defaultAuthType = AuthType.Bearer;
  
  private readonly authTypeGueardmap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > =  {
    [AuthType.Bearer]: this.accessTokenGueard,
    [AuthType.None]: { canActivate: () => true },
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGueard: AccessTokenGuard,

  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const authTypes = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [
        context.getHandler(), 
        context.getClass()
      ]
    ) ?? [AuthanticationGuard.defaultAuthType];

    const guards = authTypes.map(type => this.authTypeGueardmap[type]).flat();
    
    for(const instance of guards) {

      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch(error => {
        error
      }) 

      if(canActivate) {
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
