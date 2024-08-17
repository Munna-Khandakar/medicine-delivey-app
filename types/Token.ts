import {UserRole} from '@/types/UserRole';

export type Token = {
    iss: string;
    aud: string;
    role: UserRole[];
    iat: number;
    exp: number;
}