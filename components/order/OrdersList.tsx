'use client';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';
import useSWR from 'swr';
import api from '@/lib/apiInstance';
import {useEffect, useState} from 'react';
import {Cookie} from '@/utils/Cookie';
import {OrderResponse} from '@/types/OrderResponse';
import {Skeleton} from '@/components/ui/skeleton';
import NoOrderImg from './no-order.svg';
import Image from 'next/image';
import {MedicineUtils} from '@/utils/MedicineUtils';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function OrdersList() {
    const [ownUserId, setOwnUserId] = useState<string | null>(null);

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<OrderResponse[]>(ownUserId ? `orders/user/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);

    return (
        <div className="container p-4 min-h-screen">
            <Card className="rounded">
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                        {`You have ${data?.length ? data.length : 0} active orders.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {
                        isLoading && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index}
                                         className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-gray-300"/>
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-1/2"/>
                                            <Skeleton className="h-4 w-1/4"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {
                        data?.length === 0
                            ?
                            <div className="text-center text-muted-foreground">
                                <Image src={NoOrderImg} alt={'no order'}/>
                                <p>No orders found</p>
                            </div>
                            : <div>
                                {
                                    data?.map((order, index) => (
                                        <Link
                                            href={'/order/1'}
                                            key={index}
                                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                        >
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {MedicineUtils.getNamesFromOrderItems(order.orderItems)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.status}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                    }

                </CardContent>
            </Card>
        </div>
    );
}
