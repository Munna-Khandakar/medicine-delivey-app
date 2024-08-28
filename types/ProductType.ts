import {Brand} from '@/types/Brand';
import {Category} from '@/types/Category';
import {Country} from '@/types/Country';

export type ProductType = {
    category: Category
    country: Country;
    coupons: string[];
    description: string;
    discount: number;
    expires: string;
    howToUse: string;
    imageUrl: string;
    ingredients: string;
    price: number;
    productId: string;
    productName: string;
    stock: number;
    brand: Brand
}

export type ProductInput = {
    productName: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    discount: number;
    brandId: string;
    expires: string;
    countryId: string;
    description: string;
    howToUse: string;
    ingredients: string;
    stock: number;
    coupons: string[];
}