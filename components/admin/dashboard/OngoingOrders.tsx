'use client';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Fragment, useState} from 'react';
import {DateRange} from 'react-day-picker';
import useSWR from 'swr';
import {OrderResponse} from '@/types/OrderResponse';
import api from '@/lib/apiInstance';
import {OrderStauts} from '@/types/enum/OrderStauts';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {Check, Eye} from 'lucide-react';
import Modal from '@/components/Modal';
import OrderDetailsSLip from '@/components/admin/common/OrderDetailsSLip';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {Skeleton} from '@/components/ui/skeleton';


const fetcher = (url: string) => api.get(url).then((res) => res.data);


export const OngoingOrders = () => {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().setHours(0, 0, 0, 0)),
        to: new Date(),
    });
    const {toast} = useToast();
    const router = useRouter();
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [openOrderAcceptModal, setOpenOrderAcceptModal] = useState(false);
    const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);

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

    if (isLoading) {
        return <OngoingOrdersLoader/>;
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className="text-2xl font-semibold">
                    Initiated Orders
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 max-h-[14rem] overflow-y-scroll">
                        {
                            data?.filter((order) => order.status === OrderStauts.INITIATED).map((order) => (
                                <li key={order.id}
                                    className="hover:bg-slate-50 flex p-1 gap-2 justify-between rounded-md">
                                    <div>
                                        <p className="text-slate-500 text-xs">Order ID</p>
                                        <span className="text-slate-800 text-sm"> {order.transactionId}</span>
                                    </div>
                                    <div className="space-x-2">
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
                                        </Tooltip>
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
                                            <TooltipContent>{'Accept this order'}</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end">
                        <Button variant={'outline'}
                                onClick={() => router.push('/admin/orders')}
                        >View All</Button>
                    </div>
                </CardFooter>
            </Card>
            <Modal isOpen={openOrderDetailsModal} onClose={() => {
                setSelectedOrderId('');
                setOpenOrderDetailsModal(false);
            }} title={'Oder Details'}>
                {
                    selectedOrderId
                    && <OrderDetailsSLip orderId={selectedOrderId}/>
                }
            </Modal>
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
            </Modal>
        </Fragment>
    );
};

const OngoingOrdersLoader = () => {
    return (
        <Card>
            <CardHeader className="text-2xl font-semibold">
                <Skeleton className="h-6 w-1/4"/>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {Array.from({length: 5}).map((_, index) => (
                        <li key={index} className="hover:bg-slate-50 flex p-1 gap-2 justify-between rounded-md">
                            <div>
                                <Skeleton className="h-4 w-20"/>
                                <Skeleton className="h-4 w-32 mt-1"/>
                            </div>
                            <div className="space-x-2 flex">
                                <Skeleton className="h-8 w-8"/>
                                <Skeleton className="h-8 w-8"/>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-24"/>
                </div>
            </CardFooter>
        </Card>
    );
};