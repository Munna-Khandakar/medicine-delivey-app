import {CartItem} from '@/types/CartItem';

export interface CartState {
    items: CartItem[];
    setItems: (item: CartItem) => void;
    getItemsQuantityCount: () => number;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}