'use client';

import {SectionLabel} from '@/components/SectionLabel';
import {useParams} from 'next/navigation';
import {MEDICINE} from '@/constants/Medicines';
import {ProductCard} from '@/components/medicine/ProductCard';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';

const LABEL = 'Similar Products';
const fetcher = (url: string) => api.get(url).then((res) => res.data);


export const SimiliarProducts = () => {

    const {category_slug} = useParams();
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductType[]>('products', fetcher, {revalidateOnFocus: false});


    return (
        <div>
            <SectionLabel label={LABEL}/>
            <div className="flex flex-1 flex-nowrap gap-2 items-start overflow-x-auto py-2 no-scrollbar">
                {
                    isLoading &&
                    <div className="flex gap-2">
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
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
                    data?.map((medicine, index) => (
                        <ProductCard
                            key={index}
                            product={medicine}
                        />
                    ))
                }
            </div>
        </div>
    );
};