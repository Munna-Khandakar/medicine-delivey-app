'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Fragment} from 'react';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {AddToCartButton} from '@/components/AddToCartButton';
import {ProductResponse} from '@/types/ProductResponse';
import MedicineDemo from '../../medicine/medicine-demo.png';
type ProductHeroProps = {
    product: ProductResponse
}

export const ProductHero = (props: ProductHeroProps) => {

    const {product} = props;

    return (
        <div className="flex gap-4 md:gap-8">
            <div
                className="h-[180px] md:h-[250px] w-[180px] md:w-[250px] rounded-lg p-4 border items-center flex justify-center">
                <Image
                    src={MedicineDemo} alt={product?.productName}
                    className="w-full h-full hover:scale-110 transition"
                    width={220} height={220} objectFit={'contain'}
                />
            </div>
            <div className="flex flex-col justify-between w-full">
                <div>
                    <h1 className="text-base md:text-2xl font-medium leading-5 md:leading-9">{product?.productName}</h1>
                    {
                        product?.description &&
                        <Link
                            href={`/company/${product?.brand}`}
                            className="text-teal-900 font-normal text-xs md:text-sm leading-2 md:leading-7">Visit
                            all {product?.brand} Company &apos;s Product
                        </Link>
                    }
                    <br/>
                </div>
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mt-4">
                                <span className="text-slate-900 font-bold text-xs md:text-lg leading-9">
                                MRP:
                                </span>
                            <span className={`${product?.discount ? 'line-through text-slate-400' : ''}`}>
                                ৳{product?.price}
                                </span>
                            {
                                product?.discount &&
                                <Fragment>
                                    <Badge variant="secondary" className="text-red-500">
                                        {MedicineUtils.calculateDiscountPercentage(product?.price, product.discount)}%
                                        OFF
                                    </Badge>
                                    <br/>
                                    <span
                                        className="font-bold text-slate-900">৳{product?.price - product?.discount}</span>
                                </Fragment>
                            }
                        </div>
                        <AddToCartButton medicineId={product?.productId as string} stock={product?.stock || 0}/>
                    </div>
                    <p className="text-xs text-slate-500">Inclusive of all taxes</p>
                    <p className="text-xs text-slate-500 mt-4">
                        Delivery by <b>Today, before 10:00 pm</b>
                    </p>
                </div>
            </div>
        </div>
    );

};