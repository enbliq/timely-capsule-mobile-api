import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { authTypes } from '../decorator/authTypes';
import { AUTH_TYPE_KEY } from '../decorator/constants';
import { AccessTokenGuard } from './access-token-guard';
  
  /**
   * @description AuthGuardGuard is responsible for handling authentication using different strategies.
   * It checks the authentication type and applies the corresponding guard.
   */
  @Injectable()
  export class AuthGuardGuard implements CanActivate {
    /**
     * Default authentication type set to Bearer Token.
     */
    private static readonly defaultAuthType = authTypes.Bearer;
  
    /**
     * Maps authentication types to their corresponding guard implementations.
     */
    private readonly authTypeGuardMap: Record<
      authTypes,
      CanActivate | CanActivate[]
    > = {
      [authTypes.Bearer]: this.accessTokenGuard,
      [authTypes.None]: { canActivate: () => true },
    };
  
    constructor(
      private readonly reflector: Reflector,
      private readonly accessTokenGuard: AccessTokenGuard,
    ) {}
  
    /**
     * Determines whether the request can be processed based on the authentication type.
     * @param context ExecutionContext - The execution context of the request.
     * @returns Promise<boolean> - Returns true if authentication is successful; otherwise, throws UnauthorizedException.
     */
    @ApiBearerAuth() // Indicates that the endpoint requires Bearer authentication
    @ApiUnauthorizedResponse({ description: 'Unauthorized' }) // Documents the 401 response
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Retrieve authentication types from metadata or use the default
      const authTypes =
        this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? [AuthGuardGuard.defaultAuthType];
  
      // Map auth types to their respective guards
      const guards = authTypes.map((type) => this.authTypeGuardMap[type]);
  
      // Iterate through the guards and invoke canActivate
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context))
          .catch((err) => {
            throw new UnauthorizedException(err);
          });
  
        if (canActivate) {
          return true;
        }
      }
  
      throw new UnauthorizedException();
    }
  }  