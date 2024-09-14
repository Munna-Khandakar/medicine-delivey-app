'use client';

import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {CircleUserRound, Flag, Home, Package, PanelLeft, ShoppingCart, SquareMenu, Tag, Users} from 'lucide-react';
import Link from 'next/link';
import {Input} from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import {GearIcon} from '@radix-ui/react-icons';
import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {User} from '@/types/User';
import api from '@/lib/apiInstance';
import {Cookie} from '@/utils/Cookie';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const AdminHeader = () => {

    const [open, setOpen] = useState(false);
    const [ownUserId, setOwnUserId] = useState<string | null>(null);
    const {data} = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});
    const router = useRouter();

    const NavItems = [
        {
            icon: Home,
            label: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            icon: ShoppingCart,
            label: 'Orders',
            href: '/admin/orders',
        },
        {
            icon: Package,
            label: 'Products',
            href: '/admin/products',
        },
        {
            icon: Users,
            label: 'Customers',
            href: '/admin/customers',
        },
        {
            icon: Flag,
            label: 'Countries',
            href: '/admin/countries',
        },
        {
            icon: SquareMenu,
            label: 'Categories',
            href: '/admin/categories',
        },
        {
            icon: Tag,
            label: 'Brands',
            href: '/admin/brands',
        },
    ];

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);


    return (
        <header
            className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5"/>
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        {
                            NavItems.map(({icon: Icon, label, href}) => (
                                <Link key={label} href={href}
                                      className="flex items-center gap-2 p-4 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground">
                                    <Icon className="h-6 w-6"/>
                                    <span>{label}</span>
                                </Link>
                            ))
                        }
                    </nav>
                </SheetContent>
            </Sheet>
            {/*<Breadcrumb className="hidden md:flex">*/}
            {/*    <BreadcrumbList>*/}
            {/*        <BreadcrumbItem>*/}
            {/*            <BreadcrumbLink asChild>*/}
            {/*                <Link href="#">Dashboard</Link>*/}
            {/*            </BreadcrumbLink>*/}
            {/*        </BreadcrumbItem>*/}
            {/*        <BreadcrumbSeparator/>*/}
            {/*        <BreadcrumbItem>*/}
            {/*            <BreadcrumbLink asChild>*/}
            {/*                <Link href="#">Orders</Link>*/}
            {/*            </BreadcrumbLink>*/}
            {/*        </BreadcrumbItem>*/}
            {/*        <BreadcrumbSeparator/>*/}
            {/*        <BreadcrumbItem>*/}
            {/*            <BreadcrumbPage>Recent Orders</BreadcrumbPage>*/}
            {/*        </BreadcrumbItem>*/}
            {/*    </BreadcrumbList>*/}
            {/*</Breadcrumb>*/}
            <div className="relative ml-auto flex-1 md:grow-0">
                <Input className="border w-[250px]"
                       placeholder="Type a command or search..."
                       onFocus={() => setOpen(true)}
                />

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..."/>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Settings">
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                router.push('/admin/settings/reset-password');
                            }}>
                                <GearIcon className="mr-2 h-4 w-4"/>
                                <span>Change Password</span>
                            </CommandItem>
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                router.push('/admin/products/new');
                            }}>
                                <GearIcon className="mr-2 h-4 w-4"/>
                                <span>Add Product</span>
                            </CommandItem>
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                router.push('/logout');
                            }}>
                                <GearIcon className="mr-2 h-4 w-4"/>
                                <span>Logout</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        {
                            data?.profilePictureUrl
                                ? <img src={data.profilePictureUrl} alt="profile"
                                       className="w-[2rem] h-[2rem] object-cover rounded-full shadow border "/>
                                : <CircleUserRound className="w-[26px]"/>
                        }
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/admin/settings/profile')}>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => router.push('/')}>Home</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => router.push('/login')}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};