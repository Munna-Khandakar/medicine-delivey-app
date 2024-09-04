'use client';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import Logo from '@/public/fullLogo.png';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {Category} from '@/types/Category';

const SOCIAL_LINKS = {
    FACEBOOK: 'https://www.facebook.com/profile.php?id=61562212855960&mibextid=ZbWKwL',
    YOUTUBE: 'https://www.youtube.com/@Pharmatic24',
    WHATSAPP: 'https://wa.me/01521329980',
    EMAIL: 'mailto:pharmatic24@gmail.com'
};

const categoriesFetcher = (url: string) => api.get(url).then((res) => res.data);

export const Footer = () => {

    const pathName = usePathname();

    const {
        data: categories,
        isLoading: categoriesLoading
    } = useSWR<Category[]>('categories', categoriesFetcher, {revalidateOnFocus: false});

    if (pathName.match('/login') || pathName.match('/signup') || pathName.match('/admin')) {
        return null;
    }

    return (
        <footer className="font-sans tracking-wide bg-teal-950 container py-8 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                <div>
                    <a href="#">
                        <Image className="w-24 md:w-44" src={Logo} alt={'logo'}/>
                    </a>

                    <ul className="mt-10 flex space-x-5">
                        <li>
                            <a href={SOCIAL_LINKS.FACEBOOK}
                               target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round"
                                     className="lucide lucide-facebook text-gray-300 hover:text-white">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href={SOCIAL_LINKS.YOUTUBE} target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round"
                                     className="lucide lucide-youtube text-gray-300 hover:text-white">
                                    <path
                                        d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                                    <path d="m10 15 5-3-5-3z"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href={SOCIAL_LINKS.WHATSAPP} target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round"
                                     className="lucide lucide-message-circle-more text-gray-300 hover:text-white">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                    <path d="M8 12h.01"/>
                                    <path d="M12 12h.01"/>
                                    <path d="M16 12h.01"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href={SOCIAL_LINKS.EMAIL} target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round"
                                     className="lucide lucide-at-sign text-gray-300 hover:text-white">
                                    <circle cx="12" cy="12" r="4"/>
                                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-lg relative max-sm:cursor-pointer">Services <svg
                        xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                        className="sm:hidden absolute right-0 top-1 fill-[#d6d6d6]" viewBox="0 0 24 24">
                        <path
                            d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z"
                            data-name="16" data-original="#000000"></path>
                    </svg>
                    </h4>

                    <ul className="mt-6 space-y-5">
                        <li>
                            <a href="#" className="hover:text-white text-gray-300 text-sm">Order Medicine</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white text-gray-300 text-sm">Healthcare Products</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white text-gray-300 text-sm">Support</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-lg relative max-sm:cursor-pointer">Feature
                        Categories <svg
                            xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                            className="sm:hidden absolute right-0 top-1 fill-[#d6d6d6]" viewBox="0 0 24 24">
                            <path
                                d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z"
                                data-name="16" data-original="#000000"></path>
                        </svg>
                    </h4>
                    <ul className="space-y-5 mt-6 max-sm:hidden">
                        {
                            categoriesLoading && <p className="text-white">loading...</p>
                        }
                        {
                            categories?.slice(0, 3).map((category) => (
                                <li key={category.label}>
                                    <a href={`/category/${category.id}`}
                                       className="hover:text-white text-gray-300 text-sm">{category.label}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-lg relative max-sm:cursor-pointer">Company <svg
                        xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                        className="sm:hidden absolute right-0 top-1 fill-[#d6d6d6]" viewBox="0 0 24 24">
                        <path
                            d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z"
                            data-name="16" data-original="#000000"></path>
                    </svg>
                    </h4>

                    <ul className="space-y-5 mt-6 ">
                        <li>
                            <a href="/about-us" className="hover:text-white text-gray-300 text-sm">About us</a>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="my-10 border-gray-400"/>

            <div className="flex flex-wrap max-md:flex-col gap-4">
                <ul className="md:flex md:space-x-6 max-md:space-y-2">
                    <li>
                        <a href="/terms-condition" className="hover:text-white text-gray-300 text-sm">Terms &
                            Condition</a>
                    </li>
                    <li>
                        <a href="/privacy-policy" className="hover:text-white text-gray-300 text-sm">Privacy
                            Policy</a>
                    </li>
                    <li>
                        <a href="/disclaimer" className="hover:text-white text-gray-300 text-sm">Disclaimer</a>
                    </li>
                </ul>

                <p className="text-gray-300 text-sm md:ml-auto">
                    Copyright © 2024
                    <a href="/" target="_blank" className="hover:underline mx-1">Pharmatic.</a>All
                    Rights Reserved.</p>
            </div>
        </footer>
    );
};