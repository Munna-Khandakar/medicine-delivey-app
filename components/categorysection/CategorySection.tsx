'use client';

import useSWR from 'swr';
import api from '@/lib/apiInstance';
import {CategoryCard} from '@/components/categorysection/CategoryCard';
import {SectionLabel} from '@/components/SectionLabel';
import {Skeleton} from '@/components/ui/skeleton';
import {Category} from '@/types/Category';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';


const SECTION_LABEL = 'Shop by Categories';

const categoriesFetcher = (url: string) => api.get(url).then((res) => res.data);

export const CategorySection = () => {

    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesLoading
    } = useSWR<Category[]>('categories', categoriesFetcher, {revalidateOnFocus: false});

    return (
        <section className="container mx-auto">
            <SectionLabel label={SECTION_LABEL}/>
            <div className="flex flex-1 flex-nowrap no-scrollbar gap-4 items-center overflow-x-auto py-2">
                {
                    categoriesError &&
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Sorry, there is something wrong with internet.
                        </AlertDescription>
                    </Alert>
                }
                {
                    categoriesLoading &&
                    <div className="flex gap-2">
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
                        <Skeleton className="w-[100px] md:w-[160px] h-[100px]"/>
                    </div>
                }
                {
                    categories?.map((category) => (
                        <CategoryCard key={category.label} category={category}/>
                    ))
                }
            </div>
        </section>
    );
};