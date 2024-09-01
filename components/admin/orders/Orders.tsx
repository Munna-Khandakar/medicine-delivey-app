'use client';

import {Fragment, useState} from 'react';
import useSWR from 'swr';
import {format} from 'date-fns';
import {DateRange} from 'react-day-picker';
import {Check, Eye, PackageCheck, Truck, X} from 'lucide-react';
import {CalendarIcon} from '@radix-ui/react-icons';
import {TableCell, TableHead, TableRow,} from '@/components/ui/table';
import {SimpleTable} from '@/components/SimpleTable';
import {OrderResponse} from '@/types/OrderResponse';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import OrderDetailsSLip from '@/components/admin/common/OrderDetailsSLip';
import {useToast} from '@/components/ui/use-toast';
import {OrderStauts} from '@/types/enum/OrderStauts';
import {Skeleton} from '@/components/ui/skeleton';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar} from '@/components/ui/calendar';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {cn} from '@/lib/utils';
import api from '@/lib/apiInstance';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function Orders() {

    const {toast} = useToast();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().setHours(0, 0, 0, 0)),
        to: new Date(),
    });
    const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
    const [openOrderAcceptModal, setOpenOrderAcceptModal] = useState(false);
    const [openOrderCancelModal, setOpenOrderCancelModal] = useState(false);
    const [openOrderOntheWayModal, setOpenOrderOntheWayModal] = useState(false);
    const [openOrderCompleteModal, setOpenOrderCompleteModal] = useState(false);
    const [openImageViewModal, setOpenImageViewModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const {
        data,
        isLoading,
        mutate
    } = useSWR<OrderResponse[]>(date ? `orders/within-date?startDate=${date?.from!.toISOString()}&endDate=${date.to?.toISOString()}` : null, fetcher, {revalidateOnFocus: false});

    const acceptSelectedOrder = () => {
        api.post('/orders/update-status', {orderId: selectedOrderId, status: OrderStauts.ACCEPTED}).then(() => {
            toast({
                title: 'Success',
                description: 'Order is accepted',
            });
            mutate();
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

    const cancelSelectedOrder = () => {
        api.post('/orders/update-status', {orderId: selectedOrderId, status: OrderStauts.FAILED}).then(() => {
            toast({
                title: 'Success',
                description: 'Order is cancelled',
            });
            mutate();
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

    const onTheWaySelectedOrder = () => {
        api.post('/orders/update-status', {orderId: selectedOrderId, status: OrderStauts.ON_THE_WAY}).then(() => {
            toast({
                title: 'Success',
                description: 'Order is updated to on the way',
            });
            mutate();
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

    const completeSelectedOrder = () => {
        api.post('/orders/update-status', {orderId: selectedOrderId, status: OrderStauts.COMPLETED}).then(() => {
            toast({
                title: 'Success',
                description: 'Order is completed',
            });
            mutate();
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

    return (
        <Fragment>
            <SimpleTable
                title="Orders"
                subTitle="List of all orders"
                actionItems={
                    <div className="ml-auto pr-2 gap-1 flex flex-1 md:grow-0">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={'outline'}
                                    className={cn(
                                        'w-[300px] justify-start text-left font-normal',
                                        !date && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, 'LLL dd, y')} -{' '}
                                                {format(date.to, 'LLL dd, y')}
                                            </>
                                        ) : (
                                            format(date.from, 'LLL dd, y')
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        {/*<div className="relative">*/}
                        {/*    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>*/}
                        {/*    <Input*/}
                        {/*        type="search"*/}
                        {/*        placeholder="Search..."*/}
                        {/*        className="w-full rounded-md bg-background pl-8 md:w-[200px] lg:w-[336px]"*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Transaction Id</TableHead>
                        <TableHead className="hidden md:table-cell">Items</TableHead>
                        <TableHead className="hidden md:table-cell">Delivery Charge</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Prescription</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                }
                tableBody={
                    isLoading
                        ? <Fragment>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                        : data?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.transactionId}</TableCell>
                                <TableCell
                                    className="hidden md:table-cell">{MedicineUtils.getNamesFromOrderItems(order.orderItems)}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.deliveryCharge}</TableCell>
                                <TableCell>{order.totalAmount}</TableCell>
                                <TableCell>{order.deliveryDate}</TableCell>
                                <TableCell>
                                    {
                                        !order.prescriptionUrl
                                            ? <span className="text-muted-foreground">No Prescription</span>
                                            : <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        className="w-fit h-fit p-0"
                                                        variant='ghost'
                                                        onClick={() => {
                                                            setSelectedOrderId(order.id);
                                                            setOpenImageViewModal(true);
                                                        }}
                                                    >
                                                        <img
                                                            alt="customr prescription"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="64"
                                                            src={order.prescriptionUrl}
                                                            width="64"
                                                        />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{'See Prescription'}</TooltipContent>
                                            </Tooltip>
                                                }
                                            </TableCell>
                                        <TableCell>
                                        <Badge variant={order.status === OrderStauts.INITIATED ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                    <TableCell className="flex gap-1">
                    <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant={'outline'} size={'icon'}
                aria-label={'Accept this order'}
                disabled={order.status === OrderStauts.ACCEPTED}
                onClick={() => {
                    setSelectedOrderId(order.id);
                    setOpenOrderAcceptModal(true);
                }}>
                <Check size={15} color={'green'}/>
            </Button>
        </TooltipTrigger>
    <TooltipContent>{'Accept this order'}</TooltipContent>;
</Tooltip>
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant={'outline'} size={'icon'}
                    aria-label={'Cancel this order'}
                    disabled={order.status === OrderStauts.FAILED}
                    onClick={() => {
                        setSelectedOrderId(order.id);
                        setOpenOrderCancelModal(true);
                    }}>
                <X size={15} color={'red'}/>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{'Cancel this order'}</TooltipContent>
    </Tooltip>;
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant={'outline'} size={'icon'}
                    aria-label={'on the way this order'}
                    disabled={order.status === OrderStauts.ON_THE_WAY}
                    onClick={() => {
                        setSelectedOrderId(order.id);
                        setOpenOrderOntheWayModal(true);
                    }}>
                <Truck size={15} color={'blue'}/>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{'On the way'}</TooltipContent>
    </Tooltip>;
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant={'outline'} size={'icon'}
                    aria-label={'Complete this order'}
                    disabled={order.status === OrderStauts.COMPLETED}
                    onClick={() => {
                        setSelectedOrderId(order.id);
                        setOpenOrderCompleteModal(true);
                    }}>
                <PackageCheck size={15} color={'green'}/>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{'Complete this order'}</TooltipContent>
    </Tooltip>;
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                variant={'outline'} size={'icon'}
                aria-label={'See this order'}
                onClick={() => {
                    setSelectedOrderId(order.id);
                    setOpenOrderDetailsModal(true);
                }}>
                <Eye size={15}/>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{'See this order'}</TooltipContent>
    </Tooltip>;
</TableCell>
</TableRow>
))
}
/>
    <Modal isOpen={openOrderDetailsModal} onClose={() => {
        setSelectedOrderId('');
        setOpenOrderDetailsModal(false);
    }} title={'Oder Details'}>
        {
            selectedOrderId
            && <OrderDetailsSLip orderId={selectedOrderId}/>
        }
    </Modal>;
    <Modal isOpen={openOrderAcceptModal} onClose={() => {
        setSelectedOrderId('');
        setOpenOrderAcceptModal(false);
    }} title={'Accept Order'}>
        {
            selectedOrderId
            && <div>
                <div className="text-lg font-normal">Are you sure you want to accept this order?</div>
                <div className="flex gap-2 mt-4">
                    <Button variant={'outline'} onClick={() => {
                        setOpenOrderAcceptModal(false);
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        setOpenOrderAcceptModal(false);
                        acceptSelectedOrder();
                    }}>Accept</Button>
                </div>
            </div>
        }
    </Modal>;

    <Modal isOpen={openOrderOntheWayModal} onClose={() => {
        setSelectedOrderId('');
        setOpenOrderOntheWayModal(false);
    }} title={'On the way'}>
        {
            selectedOrderId
            && <div>
                <div className="text-lg font-normal">Are you sure you want to send this order?</div>
                <div className="flex gap-2 mt-4">
                    <Button variant={'outline'} onClick={() => {
                        setOpenOrderOntheWayModal(false);
                    }}>No</Button>
                    <Button onClick={() => {
                        setOpenOrderOntheWayModal(false);
                        onTheWaySelectedOrder();
                    }}>Yes</Button>
                </div>
            </div>
        }
    </Modal>;
    <Modal isOpen={openOrderCancelModal} onClose={() => {
        setSelectedOrderId('');
        setOpenOrderCancelModal(false);
    }} title={'Accept Order'}>
        {
            selectedOrderId
            && <div>
                <div className="text-lg font-normal">Are you sure you want to cancel this order?</div>
                <div className="flex gap-2 mt-4">
                    <Button variant={'outline'} onClick={() => {
                        setOpenOrderCancelModal(false);
                    }}>No</Button>
                    <Button onClick={() => {
                        setOpenOrderCancelModal(false);
                        cancelSelectedOrder();
                    }}>Yes</Button>
                </div>
            </div>
        }
    </Modal>;
    <Modal isOpen={openOrderCompleteModal} onClose={() => {
        setSelectedOrderId('');
        setOpenOrderCompleteModal(false);
    }} title={'Complete Order'}>
        {
            selectedOrderId
            && <div>
                <div className="text-lg font-normal">Is this order is complete?</div>
                <div className="flex gap-2 mt-4">
                    <Button variant={'outline'} onClick={() => {
                        setOpenOrderCompleteModal(false);
                    }}>No</Button>
                    <Button onClick={() => {
                        setOpenOrderCompleteModal(false);
                        completeSelectedOrder();
                    }}>Yes</Button>
                </div>
            </div>
        }
    </Modal>
            <Modal isOpen={openImageViewModal} onClose={() => {
                setSelectedOrderId('');
                setOpenImageViewModal(false);
            }} title={'View Prescription'}>
                {
                    selectedOrderId
                    && <div>
                        <img
                            alt="customr prescription"
                            className="rounded-md object-cover"
                            src={data?.find((order) => order.id === selectedOrderId)?.prescriptionUrl}
                        />
                    </div>
                }
            </Modal>
        </Fragment>
    )
        ;
}
