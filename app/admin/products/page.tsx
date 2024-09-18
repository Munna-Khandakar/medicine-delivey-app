import {Suspense} from 'react';
import {Products} from '@/components/admin/products/Products';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Products/>
        </Suspense>
    );
}