import {ProductForm} from '@/components/admin/products/ProductForm';

export default function Page() {
    return (
        <div>
            {typeof window !== 'undefined' && <ProductForm/>}
        </div>
    );
}