'use client';

import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {Banknote} from 'lucide-react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {useCartStore} from '@/stores/cartStore';
import {ProductType} from '@/types/ProductType';
import api from '@/lib/apiInstance';
import {Cookie} from '@/utils/Cookie';
import {User} from '@/types/User';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function Bill() {

    const {items} = useCartStore();
    const today = new Date();
    const [ownUserId, setOwnUserId] = useState<string | null>(null);

    const {data} = useSWR<ProductType[]>('products', fetcher, {revalidateOnFocus: false});

    const {data: user} = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    const calculateSubTotal = () => {
        return items?.reduce((acc, item) => {
            const product = data?.find((product) => product.productId === item.id);
            if (!product) return acc;
            const discountedPrice = product.price - product.discount;
            return acc + (discountedPrice * item.quantity);
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubTotal() + 70;
    };

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Your Invoice Details
                    </CardTitle>
                    <CardDescription>
                        {
                            today.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                        {
                            items?.map((item) => {

                                const product = data?.find((product) => product.productId === item.id);
                                const price = product?.price ?? 0;
                                const discount = product?.discount ?? 0;
                                const discountedPrice = price - discount;
                                return (
                                    <li key={item.id} className="flex items-center justify-between">
                                        <span
                                            className="text-muted-foreground">{product?.productName} x <span>{item.quantity}</span></span>
                                        <span>৳{discountedPrice}</span>
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
                            <span>৳70</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Vat</span>
                            <span>৳0.00</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>৳{calculateTotal()}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div className="grid">
                    <div className="grid">
                        <div className="font-semibold">Shipping Information</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{user?.userName}</span>
                            <span>{user?.phoneNumber}</span>
                            <span>{user?.address}</span>
                        </address>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-1 text-muted-foreground">
                                <Banknote className="h-4 w-4"/>
                                COD
                            </dt>
                            <dd>Cash On Delivery</dd>
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
