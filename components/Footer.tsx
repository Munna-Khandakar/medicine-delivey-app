'use client';
import {usePathname} from 'next/navigation';
import {PublicFooter} from '@/components/PublicFooter';

export const Footer = () => {

    const pathName = usePathname();

    if (pathName.match('/login') || pathName.match('/forget-password') || pathName.match('/admin')) {
        return null;
    } else {
        return <PublicFooter/>;
    }
};