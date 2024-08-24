'use client';

import {Fragment, useEffect, useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Minus, Plus} from 'lucide-react';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {useToast} from '@/components/ui/use-toast';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useCartStore} from '@/stores/cartStore';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {Button} from '@/components/ui/button';
import api from '@/lib/apiInstance';
import {ProductResponse} from '@/types/ProductResponse';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import MedicineDemo from '../medicine/medicine-demo.png';
import Bill from '@/components/checkout/Bill';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CheckoutPage = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const {items, getItemsQuantityCount, incrementItem, decrementItem, clearCart} = useCartStore();

    const {
        data,
        error,
        isLoading,
    } = useSWR<ProductResponse[]>('products', fetcher, {revalidateOnFocus: false});

    const placeOrder = () => {
        console.log('Order Placed');
        const formData = {
            items: items.map(item => {
                return {
                    productId: item.id,
                    quantity: item.quantity
                };
            })
        };
        onSubmit(formData);
    };

    const onSubmit = (data: any) => {
        api.post('/orders', data).then(() => {
            router.push('/orders');
            clearCart();
            toast({
                title: 'Successful',
                description: 'Order placed successfully',
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.name,
                description: error.message,
            });
        });
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <section className="container mx-auto min-h-screen pb-10">
            <h1 className="text-slate-800 font-semibold text-lg text-center md:text-start md:text-2xl py-4">Confirm Your
                Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-1 md:col-span-3">
                    <div className="flex flex-col gap-2 md:gap-4">
                        {
                            isLoading &&
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-full h-[100px]"/>
                                <Skeleton className="w-full h-[100px]"/>
                                <Skeleton className="w-full h-[100px]"/>
                            </div>
                        }
                        {
                            error &&
                            <Alert variant="destructive">
                                <ExclamationTriangleIcon className="h-4 w-4"/>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Sorry, there is something wrong with internet.
                                </AlertDescription>
                            </Alert>
                        }
                        {
                            items.map((item, index) => {
                                const product = data?.find(med => med.productId === item.id);
                                return (
                                    <div className="flex items-center justify-start border p-4 rounded-xl gap-2"
                                         key={index}>
                                        <Image src={MedicineDemo} alt={product?.productName || 'description'}
                                               className="w-[80px]"/>
                                        <div className="w-full">
                                            <div>
                                                <h1 className="text-sm  font-medium leading-5 ">{product?.productName}</h1>
                                            </div>
                                            <div
                                                className="mt-4 flex flex-col md:flex-row justify-between items-center ">
                                                <div>
                                                    <span className="text-slate-900 font-bold text-xs"> MRP:</span>
                                                    <span
                                                        className={`${product?.discount ? 'line-through text-slate-400' : ''}`}> ৳{product?.price} </span>
                                                    {
                                                        product?.discount &&
                                                        <Fragment>
                                                            <Badge variant="secondary" className="text-red-500">
                                                                {MedicineUtils.calculateDiscountPercentage(product?.price, product.discount)}%
                                                                OFF
                                                            </Badge>
                                                            <br/>
                                                            <span
                                                                className="font-bold text-slate-900">৳{product?.price - product?.discount}</span>
                                                        </Fragment>
                                                    }
                                                </div>
                                                <div className="flex items-center gap-2 justify-center">
                                                    <Button size="icon" variant="outline" className="text-xs"
                                                            onClick={() => {
                                                                decrementItem(item.id);
                                                            }}>
                                                        <Minus/>
                                                    </Button>
                                                    <Badge variant="secondary"
                                                           className="text-slate-900 rounded">{item.quantity}</Badge>
                                                    <Button size="icon" variant="outline" className="text-xs"
                                                            onClick={() => {
                                                                incrementItem(item.id);
                                                            }}>
                                                        <Plus/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <ScrollArea className="h-full md:h-[calc(100%-10rem)]">
                        <Bill/>
                    </ScrollArea>
                    {
                        getItemsQuantityCount() < 1
                            ? <div className="flex items-center justify-center h-full">
                                <h1 className="text-2xl">No Items In Your Cart</h1>
                            </div>
                            : <Button className="align-bottom w-full my-1 md:my-2" onClick={placeOrder}>
                                Confirm Order
                            </Button>
                    }
                </div>
            </div>
        </section>
    );
};