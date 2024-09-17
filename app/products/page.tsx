import {Suspense} from 'react';
import {Products} from '@/components/products/Products';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Products/>
        </Suspense>
    );
}