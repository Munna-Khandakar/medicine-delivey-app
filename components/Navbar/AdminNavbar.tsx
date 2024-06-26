'use client';
import {Fragment} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    Bell,
    Home,
    LineChart,
    Package,
    Package2, Settings,
    ShoppingCart,
    Users, Users2,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import * as React from 'react';

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
        icon: LineChart,
        label: 'Analytics',
        href: '/admin/analytics',
    },
];

export const AdminNavbar = () => {

    const pathName = usePathname();

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
                            href="#"
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