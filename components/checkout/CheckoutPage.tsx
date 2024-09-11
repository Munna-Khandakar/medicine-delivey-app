'use client';

import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import {Loader} from 'lucide-react';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {useToast} from '@/components/ui/use-toast';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useCartStore} from '@/stores/cartStore';
import {Button} from '@/components/ui/button';
import api from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import Bill from '@/components/checkout/Bill';
import {Cookie} from '@/utils/Cookie';
import {User} from '@/types/User';
import {LocalStorageKeys, LocalStorageUtils} from '@/utils/LocalStorageUtils';
import {FileUploader} from '@/components/common/FileUploader';
import {DeliveryType} from '@/types/DeliveryType';
import {CheckoutCartCard} from '@/components/medicine/CheckoutCartCard';
import {DeliveryCard} from '@/components/medicine/DeliveryCard';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const deliveryTypes: DeliveryType[] = [
    {
        id: 1,
        title: 'Regular Delivery',
        description: 'Estimate Delivery 30 mins',
        rate: 20,
    },
    {
        id: 2,
        title: 'Urgent Delivery',
        description: 'Estimate Delivery 24 hrs',
        rate: 100,
    },
    {
        id: 3,
        title: 'Courier Delivery',
        description: 'Estimate Delivery 2-3 working day',
        rate: 200,
    }
];

export const CheckoutPage = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [isOrderPlacing, setIsOrderPlacing] = useState(false);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType>(deliveryTypes[0]);
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

    const {
        data: deliveryOptions,
        isLoading: deliveryOptionsLoading,
    } = useSWR<DeliveryType[]>('/delivery-options', fetcher, {revalidateOnFocus: false});

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
            deliveryOptionId: selectedDeliveryType.id,
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

    useEffect(() => {
        if (deliveryOptions) {
            setSelectedDeliveryType(deliveryOptions[0]);
        }
    }, [deliveryOptions]);

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
                            items.map((item) => {
                                const product = data?.find(med => med.productId === item.id);
                                if (product) {
                                    return (
                                        <CheckoutCartCard
                                            key={item.id}
                                            product={product}
                                            item={item}
                                            incrementItem={incrementItem}
                                            decrementItem={decrementItem}
                                        />
                                    );
                                }
                            })
                        }
                    </div>
                    <h1 className="text-slate-800 font-semibold text-sm text-start md:text-base mt-4">Upload
                        Prescription</h1>
                    <h2 className="text-slate-500 font-nromal text-xs text-start mb-4">This is an optional work. We keep
                        prescription for safety</h2>
                    <FileUploader
                        onUploadComplete={(url) => setImageUrl(url)}
                        fileUrl={imageUrl}
                    />
                    <div>
                        <h1 className="text-slate-800 font-semibold text-sm text-start md:text-base mt-4">Choose
                            Your Delivery Type</h1>
                        <h2 className="text-slate-500 font-normal text-xs text-start mb-4">The system administrator may
                            adjust this delivery charge if necessary. You will be notified of any changes.</h2>
                        <div className="flex flex-col md:flex-row gap-2">
                            {
                                deliveryOptionsLoading
                                    ? <div
                                        className="border px-2 py-3 h-[5rem] w-full md:w-fit rounded-md items-center flex flex-col justify-center">
                                        <Skeleton className="mb-2 h-4 w-3/4"/>
                                        <Skeleton className="h-3 w-1/2"/>
                                        <Skeleton className="h-3 w-1/4"/>
                                    </div>
                                    : deliveryOptions?.map((delivery) => (
                                        <DeliveryCard
                                            key={delivery.id}
                                            delivery={delivery}
                                            selectedDeliveryType={selectedDeliveryType}
                                            setDeliveryType={setSelectedDeliveryType}
                                        />
                                    ))
                            }
                        </div>

                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <ScrollArea className="h-full md:h-[calc(100%-10rem)]">
                        <Bill deliveyType={selectedDeliveryType}/>
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
