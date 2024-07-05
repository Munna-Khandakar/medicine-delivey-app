'use client';

import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {Home, LineChart, Package, Package2, PanelLeft, ShoppingCart, Users, Users2} from 'lucide-react';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {Input} from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
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
    CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import * as React from 'react';
import {GearIcon} from '@radix-ui/react-icons';

export const AdminHeader = () => {

    const [open, setOpen] = React.useState(false);

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

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
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
                                <Link key={label} href={href} className="flex items-center gap-2 p-4 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground">
                                        <Icon className="h-6 w-6"/>
                                        <span>{label}</span>
                                </Link>
                            ))
                        }
                    </nav>
                </SheetContent>
            </Sheet>
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
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
                                <CommandItem>
                                    <GearIcon className="mr-2 h-4 w-4"/>
                                    <span>Change Password</span>
                                </CommandItem>
                                <CommandItem>
                                    <GearIcon className="mr-2 h-4 w-4"/>
                                    <span>Add Product</span>
                                </CommandItem>
                                <CommandItem>
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
                        <Image
                            src="/placeholder-user.jpg"
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="overflow-hidden rounded-full"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

    );
};