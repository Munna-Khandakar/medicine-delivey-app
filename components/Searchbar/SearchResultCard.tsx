'use client';

import {ChevronRight} from 'lucide-react';
import Link from 'next/link';
import {ProductType} from '@/types/ProductType';

type SearchResultCardProps = {
    product: ProductType
}

export const SearchResultCard = (props: SearchResultCardProps) => {

    const {product} = props;

    return (
        <Link
            href={`/${product.category.id}/${product.productId}`}
            className="w-full border-0 p-0 rounded-0"
        >
            <div
                className="flex items-center text-start w-full justify-between p-2 hover:bg-teal-50">
                <span className="text-slate-600 text-sm truncate text-nowrap font-normal ml-8">{product.productName}</span>
                <ChevronRight size={16}/>
            </div>
        </Link>

    );
};