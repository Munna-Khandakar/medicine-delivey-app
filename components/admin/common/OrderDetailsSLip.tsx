'use client';

import {Banknote} from 'lucide-react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {OrderResponse} from '@/types/OrderResponse';
import api from '@/lib/apiInstance';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

type OrderDetailsSLipProps = {
    orderId: string
};

export default function OrderDetailsSLip(props: OrderDetailsSLipProps) {

    const {orderId} = props;
    const {
        data: order,
        error,
        isLoading,
        mutate
    } = useSWR<OrderResponse>(`orders/${orderId}`, fetcher, {revalidateOnFocus: false});

    const calculateSubTotal = () => {
        return order?.orderItems?.reduce((acc, item) => {
            return acc + (item.unitPrice * item.quantity);
        }, 0);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Invoice Details
                    </CardTitle>
                    <CardDescription>
                        {
                            order?.deliveryDate
                        }
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                        {
                            order?.orderItems?.map((item) => {
                                return (
                                    <li key={item.productId} className="flex items-center justify-between">
                                        <span
                                            className="text-muted-foreground">{item?.productName} x <span>{item.quantity}</span></span>
                                        <span>৳{item.unitPrice}</span>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <Separator className="my-2"/>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>৳{calculateSubTotal()}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>৳{order?.deliveryCharge}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Vat</span>
                            <span>৳0.00</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>৳{order?.totalAmount}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div className="grid">
                    <div className="grid">
                        <div className="font-semibold">Shipping Information</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{order?.user.userName}</span>
                            <span>{order?.user.phone}</span>
                            <span>{order?.user.address}</span>
                        </address>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            {/*<dt className="flex items-center gap-1 text-muted-foreground">*/}
                            {/*    <CreditCard className="h-4 w-4"/>*/}
                            {/*    Visa*/}
                            {/*</dt>*/}
                            {/*<dd>**** **** **** 4532</dd>*/}
                            <dt className="flex items-center gap-1 text-muted-foreground capitalize">
                                <Banknote className="h-4 w-4"/>
                                {order?.paymentChannel}
                            </dt>
                        </div>
                    </dl>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    This is a system generated invoice, no signature required.
                </div>
            </CardFooter>
        </Card>
    );
}
