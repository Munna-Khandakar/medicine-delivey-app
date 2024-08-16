'use client';
import {usePathname} from 'next/navigation';
import {UserNavbar} from '@/components/Navbar/UserNavbar';

export const Navbar = () => {

    const pathName = usePathname();

    if (pathName.match('/login') || pathName.match('/signup') || pathName.match('/admin')) {
        return null;
    }

    return <UserNavbar/>;
};
