'use client';

import Link from 'next/link';
import {Fragment, useEffect, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {ProductType} from '@/types/ProductType';
import MedicineDemo from '@/components/medicine/medicine-demo.png';
import Image from 'next/image';
import {ProductQuantityInput} from '@/components/category_slug/medicine/ProductQuantityInput';
import {useCartStore} from '@/stores/cartStore';

type ProductHeroProps = {
    product: ProductType
}

export const ProductHero = (props: ProductHeroProps) => {

    const {product} = props;
    const {getCartItemById} = useCartStore();
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const item = getCartItemById(product.productId);
        if (item) {
            setQuantity(item.quantity);
        }
    }, [getCartItemById, setQuantity, product.productId]);


    return (
        <div className="flex gap-4 md:gap-8">
            <div
                className="h-[180px] md:h-[250px] w-[180px] md:w-[250px] rounded-lg p-4 border items-center flex justify-center">
                {
                    product.imageUrl
                        ? <img
                            src={product.imageUrl} alt={product?.productName}
                            className="w-full h-full object-contain hover:scale-110 transition"
                            width={220} height={220}
                        />
                        : <Image src={MedicineDemo} alt={'medicine demo image'}/>
                }
            </div>
            <div className="flex flex-col justify-between w-full">
                <div>
                    <h1 className="text-base md:text-2xl font-medium leading-5 md:leading-9">{product?.productName}</h1>
                    <p className="text-xs md:text-sm text-slate-400">{product?.composition}</p>
                    {
                        product?.brand &&
                        <Link
                            href={`/by-brand/${product?.brand.id}`}
                            className="text-teal-900 font-normal text-xs md:text-sm leading-2 md:leading-7">Visit
                            all {product?.brand.brandName} Company &apos;s Product
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
                                ৳{product?.price} <span className="text-sm text-slate-400">per piece</span>
                                </span>
                            {
                                product?.discount ?
                                    <Fragment>
                                        <Badge variant="secondary" className="text-red-500">
                                            {MedicineUtils.calculateDiscountPercentage(product.price, product.discount)}%
                                            OFF
                                        </Badge>
                                        <br/>
                                        <span
                                            className="font-bold text-slate-900">৳{product?.price - product?.discount}</span>
                                    </Fragment>
                                    : null
                            }
                        </div>
                        <ProductQuantityInput
                            stock={product?.stock || 0}
                            medicineId={product?.productId as string}
                            getSelectedQuantity={setQuantity}
                        />
                    </div>
                    {
                        quantity &&
                        <p className="text-xs text-slate-500">{`Price of ${quantity} piece is ৳${quantity * (product?.price - product?.discount)}`}</p>
                    }
                    <p className="text-xs text-slate-500">Inclusive of all taxes</p>
                </div>
            </div>
        </div>
    );

};