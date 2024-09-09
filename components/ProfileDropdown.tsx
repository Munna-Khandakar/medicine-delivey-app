import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {CircleUserRound} from 'lucide-react';
import api from '@/lib/apiInstance';
import {useState} from 'react';
import useSWR from 'swr';
import {User} from '@/types/User';
import {Cookie} from '@/utils/Cookie';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const ProfileDropdown = () => {
    const [ownUserId, setOwnUserId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const {data} = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                {
                    data?.profilePictureUrl
                        ? <img src={data.profilePictureUrl} alt="profile" className="w-[2rem] h-[2rem] object-cover rounded-full shadow border "/>
                        : <CircleUserRound className="w-[26px]"/>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {data?.userName || 'user name not set'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                    setOpen(false);
                    router.push('/order');
                }}>
                    Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setOpen(false);
                    router.push('/profile');
                }}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setOpen(false);
                    router.push('/reset-password');
                }}>
                    Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {Cookie.isAdmin() && (
                    <DropdownMenuItem onClick={() => {
                        setOpen(false);
                        router.push('/admin/dashboard');
                    }}>
                        Admin
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                    setOpen(false);
                    router.push('/login');
                }}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};