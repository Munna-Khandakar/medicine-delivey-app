import Link from 'next/link';
import {ChevronRight} from 'lucide-react';

export const SeeMoreProducts = () => {
    return (
        <div className="flex items-center justify-center w-full h-[120px] md:h-[200px]">
            <Link href={`/products`} className="flex items-center justify-between gap-1 p-2 border rounded-md">
                <span> More</span>
                <ChevronRight/>
            </Link>
        </div>
    );
}