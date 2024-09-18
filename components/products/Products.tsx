'use client';

import useSWR from 'swr';
import {PaginatedProduct} from '@/types/ProductType';
import api from '@/lib/apiInstance';
import {SectionLabel} from '@/components/SectionLabel';
import {Skeleton} from '@/components/ui/skeleton';
import {ProductLongCard} from '@/components/medicine/ProductLongCard';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const Products = () => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sortDirection = searchParams.get('sortDirection') || 'ASC';

    const {
        data,
        isLoading,
    } = useSWR<PaginatedProduct>(`products/paginated?page=${page}&size=${size}&sortDirection=${sortDirection}`, fetcher, {revalidateOnFocus: false});

    return <section className="container mx-auto">

        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center pb-4">
            <SectionLabel label={'All Products'} subLabel={'Get all your necessary product in one place'}/>
            <div className="flex gap-1">
                <Select onValueChange={(e) => {
                    router.push(`?page=${page}&size=${size}&sortDirection=${e}`);
                }}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Price"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ASC">
                                Price Low to High
                            </SelectItem>
                            <SelectItem value="DESC">
                                Price High to Low
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select onValueChange={(e) => {
                    router.push(`?page=${page}&size=${e}&sortDirection=${sortDirection}`);
                }}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Size"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="10">
                                10
                            </SelectItem>
                            <SelectItem value="20">
                                20
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
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
        <div className="flex flex-wrap gap-2">
            {data?.content.map((medicine, index) => (
                <ProductLongCard product={medicine} key={index}/>
            ))}
        </div>
        <div className="flex justify-between items-center mt-4">
            <Button variant={'secondary'} size={'sm'}
                    disabled={parseInt(page) === 0}
                    onClick={() => router.push(`?page=${parseInt(page) - 1}&size=${size}&sortDirection=${sortDirection}`)}
            >Previous</Button>
            <Button variant={'default'} size={'sm'}
                    disabled={data ? parseInt(page) === data?.totalPages - 1 : true}
                    onClick={() => router.push(`?page=${parseInt(page) + 1}&size=${size}&sortDirection=${sortDirection}`)}
            >Next</Button>
        </div>
    </section>;
};