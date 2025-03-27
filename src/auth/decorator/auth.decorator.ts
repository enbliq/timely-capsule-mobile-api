import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from './constants';
import { authTypes } from './authTypes';

/**auth constants */
export const Auth = (...authTypes: authTypes[]) => 
    SetMetadata(AUTH_TYPE_KEY, authTypes);