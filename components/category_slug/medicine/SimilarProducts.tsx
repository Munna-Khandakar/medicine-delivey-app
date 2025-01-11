'use client';

import useSWR from 'swr';
import {Fragment, useState} from 'react';
import {ArrowDown} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {SectionLabel} from '@/components/SectionLabel';
import {ProductCard} from '@/components/medicine/ProductCard';
import {fetcher} from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';


const LABEL = 'Similar Products';

type SimilarProductsProps = {
    similarProductId: string,
}

export const SimilarProducts = (props: SimilarProductsProps) => {

    const {similarProductId} = props;

    const [show, setShow] = useState(false);

    const {
        data,
        error,
        isLoading,
    } = useSWR<ProductType[]>(`products/${similarProductId}/similar`, fetcher, {revalidateOnFocus: false});

    return (
        <div>
            <Button
                variant="outline"
                className="w-full flex justify-between items-center px-1 py-2"
                onClick={() => setShow(!show)}
            >
                <span> Want to see Similar Products?</span>
                <ArrowDown size={20} color="gray"/>
            </Button>
            {
                show &&
                <Fragment>
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
                            data?.filter((medicine) => medicine.productId !== similarProductId)
                                .map((medicine, index) => (
                                    <ProductCard
                                        key={index}
                                        product={medicine}
                                    />
                                ))
                        }
                    </div>
                </Fragment>
            }
        </div>
    );
};