import Cookies from 'js-cookie';

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

    static clearCookies(): void {
        const cookies = Cookies.get();
        for (const cookie in cookies) {
            Cookies.remove(cookie);
        }
    }
}