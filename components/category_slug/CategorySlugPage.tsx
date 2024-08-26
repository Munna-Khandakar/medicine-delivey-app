'use client';

import {useParams} from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {MEDICINE} from '@/constants/Medicines';
import {ProductLongCard} from '@/components/medicine/ProductLongCard';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Category} from '@/types/Category';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CategorySlugPage = () => {

    const {category_id} = useParams();
    const categoryId = Array.isArray(category_id) ? category_id[0] : category_id;

    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesLoading
    } = useSWR<Category[]>('categories', fetcher, {revalidateOnFocus: false});

    const getCategoryName = (categoryId: string) => {
        const category = categories?.find((category) => category.id == categoryId);
        return category?.label || '-';
    };

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductType[]>(`products/category/${categoryId}`, fetcher, {revalidateOnFocus: false});

    return (
        <section className="container py-8">
            <div className="flex justify-between items-center pb-4">
                <h1 className="text-2xl">{categoryId ? getCategoryName(categoryId) : 'Products By Category'}</h1>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="apple">Popularity</SelectItem>
                            <SelectItem value="blueberry">Price Low to High</SelectItem>
                            <SelectItem value="grapes">Price High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-wrap gap-2">
                {
                    isLoading &&
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
                }
                {
                    data?.map((medicine, index) => (
                        <ProductLongCard product={medicine} key={index}/>
                    ))
                }
            </div>
        </section>
    );
};