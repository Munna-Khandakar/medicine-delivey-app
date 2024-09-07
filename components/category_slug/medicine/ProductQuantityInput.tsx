import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import React, {useEffect, useState} from 'react';
import {useToast} from '@/components/ui/use-toast';
import {useCartStore} from '@/stores/cartStore';
import {Button} from '@/components/ui/button';
import {ShoppingCart} from 'lucide-react';

type ProductQuantityInputProps = {
    stock: number;
    medicineId: string;
    getSelectedQuantity: (quantity: number) => void;
};

export const ProductQuantityInput = (props: ProductQuantityInputProps) => {
    const {stock, medicineId, getSelectedQuantity} = props;
    const {toast} = useToast();
    const [quantity, setQuantity] = useState(0);
    const {setItems, removeItem, getCartItemById} = useCartStore();

    const handleCartUpdate = (quantity: number) => {
        if (quantity === 0) {
            removeItem(medicineId);
        } else {
            setItems({id: medicineId, quantity: quantity});
            getSelectedQuantity(quantity);
        }
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value, 10);
        if (value < 1) {
            value = 1;
            toast({
                title: 'Minimum value is 1',
                description: 'You can not set quantity less than 1',
            });
        }
        if (value > stock) {
            value = stock;
            toast({
                title: 'Maximum value is stock',
                description: 'You can not set quantity more than stock',
            });
        }
        setQuantity(value);
    };

    useEffect(() => {
        const item = getCartItemById(medicineId);
        if (item) {
            setQuantity(item.quantity);
            getSelectedQuantity(item.quantity);
        }
    }, [getCartItemById, setQuantity,getSelectedQuantity, medicineId]);

    return (
        <div>
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex gap-2">
                <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                />
                <Button className="px-2 py-1 gap-2" variant={quantity ? 'default' : 'outline'}
                        onClick={() => handleCartUpdate(quantity)}
                >
                    Add <ShoppingCart size={18}/>
                </Button>

            </div>
            <p className="text-xs text-slate-600">{`Maximum order limit: ${stock}`}</p>
        </div>
    );
};