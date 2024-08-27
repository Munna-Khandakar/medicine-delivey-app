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
import {Button} from '@/components/ui/button';
import {ReceiptText, Trash, Truck} from 'lucide-react';
import {OrderStauts} from '@/types/enum/OrderStauts';
import Modal from '@/components/Modal';
import {useToast} from '@/components/ui/use-toast';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function OrdersList() {

    const {toast} = useToast();
    const [ownUserId, setOwnUserId] = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [openOrderDeleteModal, setOpenOrderDeleteModal] = useState(false);

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<OrderResponse[]>(ownUserId ? `orders/user/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    const deleteOrder = (orderId: string) => {
        api.delete(`/orders/${orderId}`).then((response) => {
            mutate();
            toast({
                title: 'Deleted',
                description: 'Order deleted successfully',
            });
        }).catch((error) => {
            console.error(error);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

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
                            : <div className="flex flex-col gap-2">
                                {
                                    data?.map((order, index) => (
                                        <div
                                            key={index}
                                            className="flex py-3 px-2 justify-between items-center rounded-md shadow hover:bg-slate-50"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <span
                                                    className={`flex h-2 w-2 rounded-full
                                                     ${order.status === OrderStauts.FAILED ? 'bg-red-500' : order.status === OrderStauts.ACCEPTED ? 'bg-green-500' : 'bg-sky-500'} `}
                                                />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {MedicineUtils.getNamesFromOrderItems(order.orderItems)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.status}
                                                    </p>
                                                    <p className="text-sm">{order.totalAmount} BDT</p>
                                                </div>
                                            </div>
                                            {
                                                //order can be deleted only if it is in INITIATED state
                                                order.status === OrderStauts.INITIATED
                                                &&
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon" variant={'outline'}
                                                            aria-label={'Delete Order'}
                                                            onClick={() => {
                                                                setSelectedOrderId(order.id);
                                                                setOpenOrderDeleteModal(true);
                                                            }}
                                                        >
                                                            <Trash/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'Delete this order'}</TooltipContent>
                                                </Tooltip>

                                            }
                                            {
                                                order.status === OrderStauts.ACCEPTED &&

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon" variant={'outline'}
                                                            aria-label={'can not delete order'}
                                                        >
                                                            <Trash color={"grey"}/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'Accepted order can not be deleted'}</TooltipContent>
                                                </Tooltip>
                                            }
                                            {
                                                order.status === OrderStauts.ON_THE_WAY
                                                &&
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            role={'div'}
                                                            size="icon" variant={'outline'}
                                                            aria-label={'On the way'}
                                                        >
                                                            <Truck/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'On the way'}</TooltipContent>
                                                </Tooltip>

                                            }
                                            {
                                                order.status === OrderStauts.COMPLETED &&
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            className="p-1 rounded-md border"
                                                            href={`/order/${order.id}`}>
                                                            <ReceiptText/>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'See Receipt'}</TooltipContent>
                                                </Tooltip>
                                            }
                                            {
                                                order.status === OrderStauts.FAILED &&
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            role={'div'}
                                                            size="icon" variant={'outline'}
                                                            aria-label={'Order  Cancelled'}
                                                        >
                                                            <Truck/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'Order  Cancelled'}</TooltipContent>
                                                </Tooltip>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                    }

                </CardContent>
            </Card>
            <Modal isOpen={openOrderDeleteModal} onClose={() => {
                setSelectedOrderId('');
                setOpenOrderDeleteModal(false);
            }} title={'Delete Order'}>
                {
                    selectedOrderId
                    && <div>
                        <div className="text-lg font-normal">Are you sure you want to delete this order?</div>
                        <div className="flex gap-2 mt-4">
                            <Button variant={'outline'} onClick={() => {
                                setOpenOrderDeleteModal(false);
                            }}>Cancel</Button>
                            <Button onClick={() => {
                                setOpenOrderDeleteModal(false);
                                deleteOrder(selectedOrderId);
                            }}>Delete</Button>
                        </div>
                    </div>
                }
            </Modal>
        </div>
    );
}
