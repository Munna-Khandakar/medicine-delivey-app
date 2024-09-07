'use client';

import {Fragment, useEffect, useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Loader, Minus, Plus} from 'lucide-react';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {useToast} from '@/components/ui/use-toast';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useCartStore} from '@/stores/cartStore';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {Button} from '@/components/ui/button';
import api from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import MedicineDemo from '../medicine/medicine-demo.png';
import Bill from '@/components/checkout/Bill';
import {Cookie} from '@/utils/Cookie';
import {User} from '@/types/User';
import {LocalStorageKeys, LocalStorageUtils} from '@/utils/LocalStorageUtils';
import {ImageUploader} from '@/components/common/ImageUploader';
import {Label} from '@/components/ui/label';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const deliveryTypes = [
    {
        id: 1,
        name: 'Regular Delivery',
        description: 'Estimate Delivery 30 mins',
        charge: 20,
    },
    {
        id: 2,
        name: 'Urgent Delivery',
        description: 'Estimate Delivery 24 hrs',
        charge: 100,
    },
    {
        id: 3,
        name: 'Courier Delivery',
        description: 'Estimate Delivery 2-3 working day',
        charge: 100,
    }
];

export const CheckoutPage = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [isOrderPlacing, setIsOrderPlacing] = useState(false);
    const [deliveryType, setDeliveryType] = useState<number>(1);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [ownUserId, setOwnUserId] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const {items, getItemsQuantityCount, incrementItem, decrementItem, clearCart} = useCartStore();

    const {
        data,
        error,
        isLoading,
    } = useSWR<ProductType[]>('products', fetcher, {revalidateOnFocus: false});

    const {
        data: user,
        isLoading: userLoading,
    } = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    const proceedToOrder = () => {
        if (user!.address == null || user!.userName == null) {
            LocalStorageUtils.setItem(LocalStorageKeys.REDIRECT, '/checkout');
            router.push('/profile');
            toast({
                title: 'Name and Address Required',
                description: 'Please Update your profile to complete this order',
            });
        } else {
            placeOrder();
        }

    };

    const placeOrder = () => {
        const formData = {
            items: items.map(item => {
                return {
                    productId: item.id,
                    quantity: item.quantity
                };
            }),
            prescriptionUrl: imageUrl,
        };
        onSubmit(formData);
    };

    const onSubmit = (data: any) => {
        setIsOrderPlacing(true);
        api.post('/orders', data).then(() => {
            router.push('/order');
            clearCart();
            toast({
                title: 'Successful',
                description: 'Order placed successfully',
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        }).finally(() => {
            setIsOrderPlacing(false);
        });
    };

    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-screen"></div>;
    }

    return (
        <section className="container mx-auto min-h-screen pb-10">
            <h1 className="text-slate-800 font-semibold text-sm text-start md:text-base mt-4">Confirm
                Your Order</h1>
            <h2 className="text-slate-500 font-nromal text-xs text-start mb-4">Please check all details before
                proceeding</h2>
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
                                    <div className="flex items-center justify-start border px-4 py-2 rounded-xl gap-2"
                                         key={index}>
                                        {
                                            product?.imageUrl == null
                                                ?
                                                <Image src={MedicineDemo} alt={product?.productName || 'description'}/>
                                                :
                                                <img src={product?.imageUrl} alt={product?.productName || 'description'}
                                                     className="w-[80px] rounded-md"/>
                                        }
                                        <div className="w-full flex flex-col md:flex-row justify-between">
                                            <div>
                                                <h1 className="text-sm  font-medium leading-5 ">{product?.productName}</h1>
                                                <div>
                                                    <span className="text-slate-900 font-bold text-xs"> MRP:</span>
                                                    <span
                                                        className={`${product?.discount ? 'line-through text-slate-400' : ''}`}> ৳{product?.price} </span>
                                                    {
                                                        product?.discount ?
                                                            <Fragment>
                                                                <Badge variant="secondary" className="text-red-500">
                                                                    {MedicineUtils.calculateDiscountPercentage(product?.price, product.discount)}%
                                                                    OFF
                                                                </Badge>
                                                                <br/>
                                                                <span
                                                                    className="font-bold text-slate-900">৳{product?.price - product?.discount}</span>
                                                            </Fragment>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 justify-start md:justify-end">
                                                <Button size="icon" variant="outline" className="text-xs"
                                                        onClick={() => {
                                                            decrementItem(item.id);
                                                        }}>
                                                    <Minus/>
                                                </Button>
                                                <Badge variant="secondary"
                                                       className="text-slate-900 rounded">
                                                    {item.quantity}
                                                </Badge>
                                                <Button size="icon" variant="outline" className="text-xs"
                                                        onClick={() => {
                                                            incrementItem(item.id);
                                                        }}>
                                                    <Plus/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>);
                            })
                        }
                    </div>
                    <h1 className="text-slate-800 font-semibold text-sm text-start md:text-base mt-4">Upload
                        Prescription</h1>
                    <h2 className="text-slate-500 font-nromal text-xs text-start mb-4">This is an optional work. We keep
                        prescription for safety</h2>
                    <ImageUploader
                        onUploadComplete={(url) => setImageUrl(url)}
                        imageUrl={imageUrl}
                    />
                    <div>
                        <h1 className="text-slate-800 font-semibold text-sm text-start md:text-base mt-4">Choose
                            Your Delivery Type</h1>
                        <h2 className="text-slate-500 font-normal text-xs text-start mb-4">The system administrator may
                            adjust this delivery charge if necessary. You will be notified of any changes.</h2>
                        <div className="flex flex-col md:flex-row gap-2">
                            {
                                deliveryTypes.map((delivery)=>{
                                    return (
                                        <div
                                            key={delivery.id}
                                            onClick={() => setDeliveryType(delivery.id)}
                                            className={`${deliveryType === delivery.id ? "border-2 border-teal-500 bg-teal-50":"border"} px-2 py-3 h-[5rem] w-fit rounded-md items-center flex flex-col justify-center`}
                                        >
                                            <Label className="mb-2">{delivery.name}</Label>
                                            <span className="text-xs">{delivery.description}</span>
                                            <span className="text-xs">Charge ৳{delivery.charge}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>

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
                            : <Button
                                disabled={!user || userLoading || isOrderPlacing}
                                className="align-bottom w-full my-1 md:my-2"
                                onClick={proceedToOrder}
                            >
                                {
                                    isOrderPlacing ? <Loader/> : 'Confirm Order'
                                }
                            </Button>
                    }
                </div>
            </div>
        </section>
    );
};
