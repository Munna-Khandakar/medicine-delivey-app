import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {CircleUserRound} from 'lucide-react';
import api from '@/lib/apiInstance';
import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {User} from '@/types/User';
import {Cookie} from '@/utils/Cookie';
import {UserRole} from '@/types/UserRole';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const ProfileDropdown = () => {

    const [ownUserId, setOwnUserId] = useState<string | null>(null);

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <CircleUserRound className="w-[26px]"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {data?.userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href={'/order'}>
                        Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={'/history'}>
                        History
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={'/profile'}>
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={'/reset-password'}>
                        Reset Password
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {
                    data?.roles.includes(UserRole.ADMIN) &&
                    <DropdownMenuItem>
                        <Link href={'/admin/dashboard'}>
                            Admin
                        </Link>
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href={'/login'}>
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};