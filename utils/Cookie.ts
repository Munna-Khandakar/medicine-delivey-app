import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {UserRole} from '@/types/UserRole';
import {Token} from '@/types/Token';

export class Cookie {
    static get(name: string): string | undefined {
        return Cookies.get(name);
    }

    static set(name: string, value: string): void {
        Cookies.set(name, value);
    }

    static remove(name: string): void {
        Cookies.remove(name);
    }

    static isLoggedIn(): boolean {
        return !!Cookies.get('token');
    }

    static isAdmin(): boolean {
        const token = Cookies.get('token');
        if (!token) {
            return false;
        }
        const decodedToken: Token = jwtDecode(token);
        return decodedToken.role === UserRole.ADMIN;
    }

    static isUser(): boolean {
        const token = Cookies.get('token');
        if (!token) {
            return false;
        }
        const decodedToken: Token = jwtDecode(token);
        return decodedToken.role === UserRole.USER;
    }

    static getPhoneFromToken(): string {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken: Token = jwtDecode(token);
            return decodedToken.aud;
        } else {
            return '';
        }

    }

    static getMyUserId(): string {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken: Token = jwtDecode(token);
            return decodedToken.userId;
        } else {
            return '';
        }
    }

    static clearCookies(): void {
        const cookies = Cookies.get();
        for (const cookie in cookies) {
            Cookies.remove(cookie);
        }
    }
}