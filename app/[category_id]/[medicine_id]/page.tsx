'use client';

import {ProductPage as Page} from '@/components/category_slug/medicine/ProductPage';
import useSWR from 'swr';
import {ProductType} from '@/types/ProductType';
import {useParams} from 'next/navigation';
import api from '@/lib/apiInstance';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function MedicinePage() {

    const {medicine_id} = useParams();

    const {
        data,
        error,
        isLoading,
    } = useSWR<ProductType>(`products/${medicine_id}`, fetcher, {revalidateOnFocus: false});

    return (
        <Page
            data={data}
            error={error}
            isLoading={isLoading}
        />
    );
}