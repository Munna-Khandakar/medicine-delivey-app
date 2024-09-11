'use client';

import {useParams} from 'next/navigation';
import {ProductForm} from '@/components/admin/products/ProductForm';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {ProductType} from '@/types/ProductType';
import {ProductFormSkeleton} from '@/components/admin/products/ProductFormSkeleton';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const Product = () => {

    const {product_id} = useParams();

    const {
        data,
        isLoading
    } = useSWR<ProductType>(product_id ? `products/${product_id}` : null, fetcher, {revalidateOnFocus: false});

    return (
        <div>
            {
                isLoading
                    ? <ProductFormSkeleton/>
                    : <ProductForm product={data}/>
            }
        </div>
    );
};