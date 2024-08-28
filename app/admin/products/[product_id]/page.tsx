import {Suspense} from 'react';
import {Product} from '@/components/admin/products/Product';

export default function ProductPage() {

    return (
        <Suspense>
            <Product/>
        </Suspense>

    );
}