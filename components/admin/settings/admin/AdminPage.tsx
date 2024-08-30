'use client';

import {Fragment} from 'react';
import useSWR from 'swr';
import {PlusCircle} from 'lucide-react';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {SimpleTable} from '@/components/SimpleTable';
import api from '@/lib/apiInstance';
import {Skeleton} from '@/components/ui/skeleton';
import {Badge} from '@/components/ui/badge';
import {User} from '@/types/User';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function AdminPage() {
    const {data, error, isLoading} = useSWR<User[]>('users', fetcher, {revalidateOnFocus: false});

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
                title="Admins"
                subTitle="Manage your admins from here."
                actionItems={
                    <div className="relative">
                        <Link className="gap-2 flex rounded-md bg-black text-white px-2 py-2 items-center" href={'/admin/settings/admin/new'}>
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="hidden md:block whitespace-nowrap text-sm">
                                  Add Admin
                            </span>
                        </Link>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Address</TableHead>
                        <TableHead className="hidden md:table-cell">Role</TableHead>
                    </TableRow>
                }
                tableBody={
                    isLoading ? renderSkeletonRows() : data?.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.userName}</TableCell>
                            <TableCell>{product.phoneNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{product.address}</TableCell>
                            <TableCell className="hidden md:table-cell"><Badge>Admin</Badge></TableCell>
                        </TableRow>
                    ))
                }
            />
        </Fragment>
    );
}