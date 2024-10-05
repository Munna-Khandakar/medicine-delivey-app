'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import useSWR from 'swr';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ProductLongCard} from '@/components/medicine/ProductLongCard';
import api from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Category} from '@/types/Category';
import {SectionLabel} from '@/components/SectionLabel';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CategorySlugPage = () => {
    const {category_id} = useParams();
    const [products, setProducts] = useState<ProductType[]>([]);
    const categoryId = Array.isArray(category_id) ? category_id[0] : category_id;

    const {
        data: category,
    } = useSWR<Category>(`categories/${category_id}`, fetcher, {revalidateOnFocus: false});

    const {
        data,
        error,
        isLoading,
    } = useSWR<ProductType[]>(`products/category/${categoryId}`, fetcher, {revalidateOnFocus: false});

    const sortProductsHighToLow = () => {
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        setProducts(sortedProducts);
    };

    const sortProductsLowToHigh = () => {
        const sortedProducts = [...products].sort((a, b) => b.price - a.price);
        setProducts(sortedProducts);
    };

    const sortProducts = (sortType: string) => {
        if (sortType === 'highToLow') {
            sortProductsHighToLow();
        } else {
            sortProductsLowToHigh();
        }
    };

    useEffect(() => {
        if (data) {
            const filteredData = data.filter((product) => product.category.id == categoryId);
            setProducts(filteredData);
        }
    }, [data, categoryId]);

    return (
        <section className="container py-8 min-h-screen">
            <div className="flex justify-between items-center pb-4">
                {
                    category
                        ? <SectionLabel label={'Category'} subLabel={`${category?.label}`}/>
                        : <Skeleton className="w-[200px] h-8"/>
                }

                <Select onValueChange={sortProducts}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="highToLow" onClick={sortProductsHighToLow}>
                                Price Low to High
                            </SelectItem>
                            <SelectItem value="lowToHigh" onClick={sortProductsLowToHigh}>
                                Price High to Low
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-wrap gap-2">
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
                {products?.map((medicine, index) => (
                    <ProductLongCard product={medicine} key={index}/>
                ))}
                {products.length === 0 && !isLoading && !error && (
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