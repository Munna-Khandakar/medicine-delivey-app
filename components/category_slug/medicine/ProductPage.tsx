'use client';

import {useCallback, useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {MEDICINE} from '@/constants/Medicines';
import {SimiliarProducts} from '@/components/category_slug/medicine/SimiliarProducts';
import {ProductHero} from '@/components/category_slug/medicine/ProductHero';
import {Medicine} from '@/types/Medicine';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductResponse} from '@/types/ProductResponse';
import {Skeleton} from '@/components/ui/skeleton';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const ProductPage = () => {

    const {medicine_id} = useParams();
    const [medicine, setMedicine] = useState<Medicine>();

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductResponse>(`products/${medicine_id}`, fetcher, {revalidateOnFocus: false});

    const getMedicine = useCallback(() => {
        return MEDICINE.find((medicine) => medicine.id === medicine_id);
    }, [medicine_id]);

    useEffect(() => {
        setMedicine(getMedicine());
    }, [setMedicine, getMedicine]);

    if (error) {
        return <div>Error...</div>;
    }

    return (
        <section className="container py-4 md:py-8 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 md:col-span-2 pr-4">
                    {
                        isLoading
                            ? <div className="flex gap-4 md:gap-8">
                                <div
                                    className="h-[180px] md:h-[250px] w-[180px] md:w-[250px] rounded-lg p-4 border items-center flex justify-center">
                                    <Skeleton className="w-full h-full"/>
                                </div>
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <Skeleton className="h-6 md:h-8 w-3/4 mb-2"/>
                                        <Skeleton className="h-4 md:h-6 w-1/2"/>
                                    </div>
                                    <div>
                                        <div
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div className="mt-4">
                                                <Skeleton className="h-4 md:h-6 w-1/4 mb-1"/>
                                                <Skeleton className="h-4 md:h-6 w-1/4"/>
                                                <Skeleton className="h-4 md:h-6 w-1/4 mt-1"/>
                                            </div>
                                            <Skeleton className="h-8 w-24 mt-4 md:mt-0"/>
                                        </div>
                                        <Skeleton className="h-4 w-1/2 mt-2"/>
                                        <Skeleton className="h-4 w-1/2 mt-4"/>
                                    </div>
                                </div>
                            </div>
                            : <ProductHero product={data!}/>
                    }

                    <hr className="my-6"/>
                    <SimiliarProducts/>
                </div>
                <div className="pl-2 my-auto hidden md:block"
                     style={{
                         transform: 'translateY(-80%)'
                     }}>
                    <div className="p-4 mt-4 border-2 rounded-lg bg-teal-50 border-dashed">
                        <p className="text-sm text-slate-800 font-semibold mb-2">Offers Just for you</p>
                        <ul className="text-sm font-normal text-slate-700">
                            <li>Get extra 10% off</li>
                            <li>Get free delivery on first delivery</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};