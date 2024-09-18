'use client';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { SectionLabel } from '@/components/SectionLabel';
import { ProductCard } from '@/components/medicine/ProductCard';
import api from '@/lib/apiInstance';
import { ProductType } from '@/types/ProductType';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SECTION_LABEL = 'Your search results';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('name');

    const { data, error, isLoading } = useSWR<ProductType[]>(`/products/name/${query}`, fetcher, { revalidateOnFocus: false });

    return (
        <section className="container mx-auto min-h-screen">
            <SectionLabel label={SECTION_LABEL} subLabel={`Searched Keyword ${query}`} />
            <div className="flex flex-1 flex-nowrap no-scrollbar gap-2 items-start overflow-x-auto py-2">
                {isLoading && (
                    <div className="flex gap-2">
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]" />
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]" />
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]" />
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Sorry, there is something wrong with internet.
                        </AlertDescription>
                    </Alert>
                )}
                {data?.map((medicine, index) => (
                    <ProductCard key={index} product={medicine} />
                ))}
                {data?.length === 0 && !isLoading && !error && (
                    <Alert>
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>No results found</AlertTitle>
                        <AlertDescription>
                            {"Sorry, we couldn't find any results for your search."}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </section>
    );
};