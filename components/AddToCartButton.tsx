'use client';

import {useEffect, useRef, useState} from 'react';
import Select from 'react-select';
import {Button} from '@/components/ui/button';
import {LocalStorageUtils} from '@/utils/LocalStorageUtils';

type AddToCartButtonProps = {
    medicineId: string
    stock: number
}

type OptionType = { value: string; label: string };

export const AddToCartButton = (props: AddToCartButtonProps) => {

    const {medicineId, stock} = props;

    const ref = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [quantityDropDownValues, setQuantityDropDownValues] = useState<OptionType[]>([]);

    const handleClick = () => {
        setShowDropdown(true);
        setMenuOpen(true);
    };

    const handleCartUpdate = (quantity: number) => {
        if (quantity === 0) {
            LocalStorageUtils.removeFromCart(medicineId);
        } else {
            LocalStorageUtils.addToCart({id: medicineId, quantity: quantity});
        }
    };

    useEffect(() => {
        const quantity = stock;
        const values: OptionType[] = [];
        for (let i = 1; i <= quantity; i++) {
            values.push({value: i + '', label: `Qty ${i}`});
        }
        if (selectedQuantity != '0') {
            values.unshift({value: '0', label: 'Remove Item'});
        }
        setQuantityDropDownValues(values);
    }, [medicineId, selectedQuantity]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {

            if (selectedQuantity !== '') {
                return;
            }

            if (ref.current && !ref.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedQuantity]);

    return (
        <div ref={ref} className="w-44">
            {
                showDropdown
                    ? <Select
                        options={quantityDropDownValues}
                        menuIsOpen={menuOpen}
                        onMenuOpen={() => setMenuOpen(true)}
                        onMenuClose={() => setMenuOpen(false)}
                        onChange={(newValue) => {
                            setSelectedQuantity(newValue!.value);
                            handleCartUpdate(parseInt(newValue!.value));
                        }}
                    />
                    : <Button onClick={handleClick}>Add To Cart</Button>
            }
        </div>
    );
};