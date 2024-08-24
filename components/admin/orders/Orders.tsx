'use client';

import {Fragment, useState} from 'react';
import {Check, Eye, Search, X} from 'lucide-react';
import {TableCell, TableHead, TableRow,} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {SimpleTable} from '@/components/SimpleTable';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {OrderResponse} from '@/types/OrderResponse';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import OrderDetailsSLip from '@/components/admin/common/OrderDetailsSLip';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function Orders() {

    const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse>();
    const {data, error, isLoading, mutate} = useSWR<OrderResponse[]>('orders', fetcher, {revalidateOnFocus: false});

    return (
        <Fragment>
            <SimpleTable
                title="Orders"
                subTitle="List of all orders"
                actionItems={
                    <div className="relative ml-auto pr-2 flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Transaction Id</TableHead>
                        <TableHead className="hidden md:table-cell">Items</TableHead>
                        <TableHead className="hidden md:table-cell">Delivery Charge</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                }
                tableBody={
                    data?.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.transactionId}</TableCell>
                            <TableCell className="hidden md:table-cell">{'item names'}</TableCell>
                            <TableCell className="hidden md:table-cell">{order.deliveryCharge}</TableCell>
                            <TableCell>{order.totalAmount}</TableCell>
                            <TableCell>{order.deliveryDate}</TableCell>
                            <TableCell>
                                <Badge>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={'outline'} size={'icon'}>
                                            <Check size={15} color={'green'}/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{'Accept this order'}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={'outline'} size={'icon'}>
                                            <X size={15} color={'red'}/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{'Cancel this order'}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={'outline'} size={'icon'}
                                            onClick={() => {
                                                setSelectedOrder({
                                                    ...order,
                                                    user: {
                                                        id: 'id',
                                                        name: 'name',
                                                        phone: 'phone',
                                                        address: 'address'
                                                    }
                                                });
                                                setOpenOrderDetailsModal(true);
                                            }}>
                                            <Eye size={15}/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{'See this order'}</TooltipContent>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))
                }
            />
            <Modal isOpen={openOrderDetailsModal} onClose={() => {
                setSelectedOrder(undefined);
                setOpenOrderDetailsModal(false);
            }} title={'Oder Details'}>
                {
                    selectedOrder
                    && <OrderDetailsSLip order={selectedOrder}/>
                }
            </Modal>
        </Fragment>
    );
}
