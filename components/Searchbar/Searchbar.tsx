'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import useSWR from 'swr';
import {Camera, ScrollText, Search, X} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {SearchResultCard} from '@/components/Searchbar/SearchResultCard';
import api from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import './searchbar.css';

const fetcher = (url: string) => api.get(url).then((res) => res.data);


export const Searchbar = () => {

    const searchInputRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchDisabled, setSearchDisabled] = useState(true);

    const router = useRouter();

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductType[]>('products', fetcher, {revalidateOnFocus: false});

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (showDropdown && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    useEffect(() => {
        setSearchDisabled(searchQuery === '');
    }, [searchQuery]);

    const gotoSearchPage = () => {
        if (searchQuery === '') return;
        router.push(`/search?name=${searchQuery}`);
    };

    return (
        <section className="container p-4 md:p-12">
            <div className="flex items-center md:items-end justify-between flex-col md:flex-row">
                <h2 className="text-base md:text-2xl font-medium leading-10">What are you looking for</h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <ScrollText size={16}/>
                        <span className="text-slate-600 text-xs md:text-sm">Order with prescription</span>
                    </div>
                    <Button variant={'outline'} size={'sm'}
                            className={`flex items-center text-xs md:text-sm justify-between gap-2 ${!searchDisabled ? '' : 'hero-cta-button text-white'} `}>
                        <Camera size={16}/>
                        Upload Now
                    </Button>
                </div>
            </div>
            <div ref={searchInputRef}
                 className="border rounded-2xl py-2 my-2 md:my-4"
            >
                <div className="flex w-full justify-between items-center space-x-2 px-2">
                    <div className="flex items-center w-full">
                        <Search className="ml-4" size={20} color="gray"/>
                        <Input
                            type="email"
                            value={searchQuery}
                            className="py-2 md:py-4 border-0 outline-none shadow-none focus:ring-0 w-full focus:outline-none focus-visible:ring-0"
                            placeholder="Search for medicines/heathcare products"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    gotoSearchPage();
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {
                            !searchDisabled &&
                            <Button className="border-0 p-1 outline-none shadow-none"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setShowDropdown(false);
                                    }}
                            >
                                <X size={25} className="border p-1 rounded-full"/>
                            </Button>
                        }

                        <Button variant={'secondary'}
                                className={`${searchDisabled ? '' : 'hero-cta-button text-white'} `}
                                disabled={searchDisabled}
                                type="button"
                                onClick={gotoSearchPage}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                {
                    showDropdown && (
                        <ul className="py-4">
                            {
                                data?.map((product) =>
                                    <SearchResultCard key={product.productId} product={product}/>
                                )
                            }
                        </ul>
                    )
                }
            </div>
        </section>
    );
};