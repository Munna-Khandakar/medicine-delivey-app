import Image from 'next/image';
import MedicineDemo from '@/components/medicine/medicine-demo.png';
import {Fragment} from 'react';
import {Badge} from '@/components/ui/badge';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {Button} from '@/components/ui/button';
import {Minus, Plus} from 'lucide-react';
import {ProductType} from '@/types/ProductType';
import {CartItem} from '@/types/CartItem';

type CheckoutCartCardProps = {
    product: ProductType;
    item: CartItem;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
}

export const CheckoutCartCard = (props: CheckoutCartCardProps) => {

    const {product, incrementItem, decrementItem, item} = props;

    return (
        <div className="flex items-center justify-start border px-4 py-2 rounded-xl gap-2">
            {
                product?.imageUrl == null
                    ?
                    <Image src={MedicineDemo} width={80} alt={product?.productName || 'description'}/>
                    :
                    <img src={product?.imageUrl} alt={product?.productName || 'description'}
                         className="w-[80px] rounded-md"/>
            }
            <div className="w-full flex flex-col md:flex-row justify-between">
                <div>
                    <h1 className="text-sm  font-medium leading-5 ">{product?.productName}</h1>
                    <div>
                        <span className="text-slate-900 font-bold text-xs"> MRP:</span>
                        <span
                            className={`${product?.discount ? 'line-through text-slate-400' : ''}`}> ৳{product?.price} </span>
                        {
                            product?.discount ?
                                <Fragment>
                                    <Badge variant="secondary" className="text-red-500">
                                        {MedicineUtils.calculateDiscountPercentage(product?.price, product.discount)}%
                                        OFF
                                    </Badge>
                                    <br/>
                                    <span
                                        className="font-bold text-slate-900">৳{(product?.price - product?.discount).toFixed(2)}</span>
                                </Fragment>
                                : null
                        }
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-start md:justify-end">
                    <Button size="icon" variant="outline" className="text-xs"
                            onClick={() => {
                                decrementItem(item.id);
                            }}>
                        <Minus/>
                    </Button>
                    <Badge variant="secondary"
                           className="text-slate-900 rounded">
                        {item.quantity}
                    </Badge>
                    <Button size="icon" variant="outline" className="text-xs"
                            onClick={() => {
                                incrementItem(item.id);
                            }}>
                        <Plus/>
                    </Button>
                </div>
            </div>
        </div>
    );
};