'use client';

import {useParams} from 'next/navigation';
import useSWR from 'swr';
import {ProductType} from '@/types/ProductType';
import api from '@/lib/apiInstance';
import {Skeleton} from '@/components/ui/skeleton';
import {ProductLongCard} from '@/components/medicine/ProductLongCard';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {Brand} from '@/types/Brand';
import {SectionLabel} from '@/components/SectionLabel';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const BrandProductPage = () => {

    const {brand_id} = useParams();

    const {
        data,
        error,
        isLoading
    } = useSWR<ProductType[]>(`products/brand/${brand_id}`, fetcher, {revalidateOnFocus: false});

    const {
        data: brand,
        isLoading: brandLoading
    } = useSWR<Brand>(`brands/${brand_id}`, fetcher, {revalidateOnFocus: false});

    return (
        <section className="container py-8 min-h-screen">
            {
                brandLoading
                    ? <Skeleton className="w-2/4 h-5"/>
                    : <SectionLabel label={`${brand?.brandName} Company's Products`}
                                    subLabel={`Browse all products from ${brand?.brandName} company`}
                    />
            }
            <div className="flex flex-wrap gap-2 my-2">
                {isLoading && (
                    <div className="border p-3 rounded-lg min-w-fit">
                        <div className="flex flex-col items-center w-[120px] md:w-[200px] gap-2">
                            <div className="flex items-center justify-center w-full h-[120px] md:h-[200px]">
                                <Skeleton className="w-full h-full"/>
                            </div>
                            <div className="w-full">
                                <Skeleton className="h-4 w-3/4 mb-2"/>
                                <Skeleton className="h-4 w-1/2"/>
                            </div>
                        </div>
                    </div>
                )}
                {data?.map((medicine, index) => (
                    <ProductLongCard product={medicine} key={index}/>
                ))}
                {data?.length === 0 && !isLoading && !error && (
                    <Alert>
                        <ExclamationTriangleIcon className="h-4 w-4"/>
                        <AlertTitle>No results found</AlertTitle>
                        <AlertDescription>
                            {'Sorry, we couldn\'t find any results for your search.'}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </section>
    );
};