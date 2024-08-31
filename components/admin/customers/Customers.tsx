'use client';

import {Fragment} from 'react';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {SimpleTable} from '@/components/SimpleTable';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {User} from '@/types/User';
import {Skeleton} from '@/components/ui/skeleton';
import {UserRole} from '@/types/enum/UserRole';

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
                // actionItems={
                //     <div className="relative">
                //         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                //         <Input
                //             type="search"
                //             placeholder="Search..."
                //             className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                //         />
                //     </div>
                // }
                tableHeader={
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Address</TableHead>
                    </TableRow>
                }
                tableBody={
                    isLoading ? renderSkeletonRows() : data?.filter((product => product.role !== UserRole.ADMIN)).map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.userName}</TableCell>
                            <TableCell>{product.phoneNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{product.address}</TableCell>
                        </TableRow>
                    ))
                }
            />
        </Fragment>
    );
}