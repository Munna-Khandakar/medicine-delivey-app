'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {Fragment} from 'react';
import {ProductType} from '@/types/ProductType';
import MedicineDemo from './medicine-demo.png';

type ProductLongCardProps = {
    product: ProductType
}

export function ProductLongCard(props: ProductLongCardProps) {

    const {product} = props;

    return (
        <Link href={`/${product.categoryId}/${product.productId}`} className="border p-3 rounded-lg min-w-fit">
            <div className="flex flex-col items-center w-[120px] md:w-[200px] gap-2">
                <div
                    className="flex items-center justify-center w-full h-[120px] md:h-[200px]">
                    <Image src={MedicineDemo} alt={product.productName}
                           width={160} objectFit={'fill'}
                           className="hover:scale-110 transition w-full  h-full"
                    />
                </div>
                <div>
                    <span
                        className="text-xs md:text-base font-medium line-clamp-2 leading-6 text-wrap truncate text-slate-800">
                    {product.productName}
                     </span>
                    <span className="text-slate-500 font-normal text-xs md:text-sm">
                    MRP:
                        <span className={`${product?.discount ? 'line-through' : ''}`}>৳{product.price}</span>
                        {
                            product?.discount &&
                            <Fragment>
                                <Badge variant="secondary" className="text-red-500">
                                    {MedicineUtils.calculateDiscountPercentage(product.price, product.discount)}% OFF
                                </Badge>
                                <br/>
                                <span className="font-bold text-slate-900">৳{product.price - product.discount}</span>
                            </Fragment>
                        }
                    </span>
                </div>
            </div>
        </Link>
    );
}
