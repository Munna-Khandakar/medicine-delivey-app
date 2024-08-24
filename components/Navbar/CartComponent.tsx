'use client';

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer';
import {Minus, Plus, ShoppingCart} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useCartStore} from '@/stores/cartStore';
import {Badge} from '@/components/ui/badge';
import {Fragment, useEffect, useState} from 'react';
import Image from 'next/image';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {Button} from '@/components/ui/button';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductResponse} from '@/types/ProductResponse';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';

import MedicineDemo from '../medicine/medicine-demo.png';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CartComponent = () => {

    const {items, getItemsQuantityCount, incrementItem, decrementItem} = useCartStore();

    const [cartItemCount, setCartItemCount] = useState(0);

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductResponse[]>('products', fetcher, {revalidateOnFocus: false});

    useEffect(() => {
        setCartItemCount(getItemsQuantityCount());
    }, [items, setCartItemCount,getItemsQuantityCount]);

    return (
        <Drawer direction="right">
            <DrawerTrigger>
                <div className="relative">
                    <ShoppingCart className="w-[26px]"/>
                    {
                        cartItemCount > 0 &&
                        <Badge variant="secondary"
                               className="absolute -top-3 -right-3 bg-red-300 px-1 py-0 rounded-2xl">{getItemsQuantityCount()}
                        </Badge>
                    }
                </div>
            </DrawerTrigger>
            <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[280px] md:w-[500px] rounded-none">
                <div className="h-screen">
                    <DrawerHeader>
                        <DrawerTitle>{`${getItemsQuantityCount()} items in your Cart`} </DrawerTitle>
                        <DrawerDescription>
                            Check The items in your cart and proceed to checkout
                        </DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[calc(100%-100px)]">
                        <div className="p-4 pb-0 flex flex-col gap-2 md:gap-4  divide-y-2">
                            {
                                isLoading &&
                                <div className="flex gap-2">
                                    <Skeleton className="w-[100px] md:w-[160px] h-[20px]"/>
                                    <Skeleton className="w-[100px] md:w-[160px] h-[20px]"/>
                                    <Skeleton className="w-[100px] md:w-[160px] h-[20px]"/>
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
                                        <div className="flex items-center justify-start gap-2" key={index}>
                                            <Image src={MedicineDemo} alt={product?.productName || 'descriptioon'}
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
                        {
                            getItemsQuantityCount() < 1
                                ? <div className="flex items-center justify-center h-full">
                                    <h1 className="text-2xl">No Items In Your Cart</h1>
                                </div>
                                : <div className="flex items-center justify-center my-4">
                                    <Link className="w-full bg-black text-white text-center px-3 py-2 rounded" href={"/checkout"}>Proceed To Checkout</Link>
                                </div>
                        }
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
};