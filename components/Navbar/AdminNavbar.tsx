'use client';
import {Fragment, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Home, Package, Settings, ShoppingCart, Users, Flag, SquareMenu, Tag} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Cookie} from '@/utils/Cookie';

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
export const AdminNavbar = () => {

    const pathName = usePathname();

    useEffect(() => {
        if (!Cookie.isAdmin()) {
            window.location.href = '/login';
        }
    }, []);

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                {
                    NavItems.map(({icon: Icon, label, href}) => (
                        <Fragment key={label}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${pathName === href ? 'bg-accent text-accent-foreground' : ''}`}
                                    >
                                        <Icon className="h-5 w-5"/>
                                        <span className="sr-only">{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{label}</TooltipContent>
                            </Tooltip>
                        </Fragment>
                    ))
                }
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/settings"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5"/>
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    );
};