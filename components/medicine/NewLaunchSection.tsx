'use client';
import {SectionLabel} from '@/components/SectionLabel';
import {ProductCard} from '@/components/medicine/ProductCard';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {PaginatedProduct} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {SeeMoreProducts} from '@/components/common/SeeMoreProducts';

const SECTION_LABEL = 'New Launches';
const SUB_LABEL = 'New wellness range just for you!';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const NewLaunchSection = () => {

    const {
        data,
        error,
        isLoading,
    } = useSWR<PaginatedProduct>('products/paginated?page=1&size=10', fetcher, {revalidateOnFocus: false});


    return (
        <section className="container mx-auto">
            <SectionLabel label={SECTION_LABEL} subLabel={SUB_LABEL}/>
            <div className="flex flex-1 flex-nowrap no-scrollbar gap-2 items-start overflow-x-auto py-2">
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
                    data?.content.map((medicine, index) => (
                        <ProductCard
                            key={index}
                            product={medicine}
                        />
                    ))
                }
                {
                    data && data.content.length > 8 && <SeeMoreProducts/>
                }
            </div>
        </section>
    );
};