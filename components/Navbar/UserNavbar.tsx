'use client';

import Link from 'next/link';
import Image from 'next/image';
import {Search} from 'lucide-react';
import {ProfileDropdown} from '@/components/ProfileDropdown';
import Icon from '@/public/icon.png';
import IconText from '@/public/textIcon.png';
import {CartComponent} from '@/components/Navbar/CartComponent';
import {Input} from '../ui/input';
import {Cookie} from '@/utils/Cookie';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';


export const UserNavbar = () => {

    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const gotoSearchPage = () => {
        if (searchQuery === '') return;
        router.push(`/search?name=${searchQuery}`);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header
            className="sticky top-0 flex p-2 md:p-4 z-50 justify-between items-center gap-4 border-b bg-background drop-shadow-lg">
            <Link className="inline-flex items-center justify-center gap-2 p-1" href={'/'}>
                <Image src={Icon} className="w-8 md:w-10" alt={'Pharmatic icon'}/>
                <Image src={IconText} className="w-36 h-10 hidden md:block" alt={'Pharmatic, Beyond Medication'}/>
            </Link>
            <div className="flex gap-2 md:gap-4">

                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search your medicine..."
                        className="w-full rounded-lg bg-background pl-8 md:min-w-[350px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                gotoSearchPage();
                            }
                        }}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <CartComponent/>
                    {
                        isMounted && Cookie.isLoggedIn()
                            ? <ProfileDropdown/>
                            : <Link href={'/login'}>Login</Link>
                    }
                </div>
            </div>
        </header>
    );
};
