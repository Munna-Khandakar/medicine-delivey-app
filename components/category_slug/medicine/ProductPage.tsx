'use client';

import {useCallback, useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {MEDICINE} from '@/constants/Medicines';
import {SimiliarProducts} from '@/components/category_slug/medicine/SimiliarProducts';
import {ProductHero} from '@/components/category_slug/medicine/ProductHero';
import {Button} from '@/components/ui/button';
import {Medicine} from '@/types/Medicine';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductResponse} from '@/types/ProductResponse';

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


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error...</div>;
    }

    return (
        <section className="container py-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 md:col-span-2 pr-4">
                    <ProductHero product={data!}/>
                    <hr className="my-6"/>
                    <SimiliarProducts/>
                </div>
                <div className="pl-2 my-auto hidden md:block"
                     style={{
                         transform: 'translateY(-80%)'
                     }}>
                    {/*<div>*/}
                    {/*    <p className="mb-4">5 items in your cart</p>*/}
                    {/*    <Button className="w-full">View Cart</Button>*/}
                    {/*</div>*/}
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