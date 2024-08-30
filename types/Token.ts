import {UserRole} from '@/types/enum/UserRole';

export type Token = {
    iss: string;
    aud: string;
    userId: string;
    role: UserRole;
    iat: number;
    exp: number;
}