import {create} from 'zustand';
import {ProductType} from '@/types/ProductType';

interface ProductState {
    products: ProductType[];
    isProductsLoading: boolean;
    setIsProductsLoading: (isLoading: boolean) => void;
    setProducts: (products: ProductType[]) => void;
}

const useProductStore = create<ProductState>()((set) => ({
    products: [],
    isProductsLoading: false,
    setIsProductsLoading: (isLoading) => set({isProductsLoading: isLoading}),
    setProducts: (products) => set({products})
}));
export default useProductStore;