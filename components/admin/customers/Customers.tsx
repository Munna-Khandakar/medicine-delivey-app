'use client';

import {Fragment} from 'react';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {SimpleTable} from '@/components/SimpleTable';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {User} from '@/types/User';
import {Skeleton} from '@/components/ui/skeleton';
import {UserRole} from '@/types/enum/UserRole';
import {Eye, Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function Customers() {
    const {data, isLoading} = useSWR<User[]>('users', fetcher, {revalidateOnFocus: false});

    const renderSkeletonRows = () => {
        return Array.from({length: 5}).map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-3/4"/></TableCell>
                <TableCell><Skeleton className="h-4 w-1/2"/></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full"/></TableCell>
            </TableRow>
        ));
    };

    return (
        <Fragment>
            <SimpleTable
                title="Customers"
                subTitle="Manage your customers and view their sales performance."
                actionItems={
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search with phone number"
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone(ID)</TableHead>
                        <TableHead className="hidden md:table-cell">Address</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                }
                tableBody={
                    isLoading ? renderSkeletonRows() : data?.filter((user => user.role !== UserRole.ADMIN)).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center justify-start gap-2">
                                    {
                                        user?.profilePictureUrl &&
                                        <img
                                            src={user?.profilePictureUrl}
                                            alt={`${user.userName} avatar`}
                                            className=" h-8 w-8 rounded-full"
                                        />
                                    }
                                    {user.userName}
                                </div>
                            </TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{user.address}</TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="border p-2 bg-slate-50 w-fit rounded-md flex items-center">
                                            <Link href={`/admin/customers/${user.id}`}
                                                  aria-label={'See this customer details'}
                                            >
                                                <Eye size={15}/>
                                            </Link>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>{'See this customer details'}</TooltipContent>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))
                }
            />
        </Fragment>
    );
}