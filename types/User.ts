import {UserRole} from '@/types/enum/UserRole';

export type User = {
    id: string;
    userName: string;
    profilePictureUrl: string;
    phoneNumber: string;
    email: string;
    address: string;
    bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
    medicalHistory?: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    role: UserRole;
    deactivated: 'true' | 'false'
}