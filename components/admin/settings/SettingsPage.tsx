import { Truck, ShieldCheck, Key, User} from 'lucide-react';
import Link from 'next/link';
import {Fragment} from 'react';
import {SectionLabel} from '@/components/SectionLabel';


export const SettingsPage = ()=>{
    const NavItems = [
        {
            icon: User,
            label: 'Profile',
            href: '/admin/settings/profile',
        },
        {
            icon: ShieldCheck,
            label: 'Admins',
            href: '/admin/settings/admin',
        },
        {
            icon: Key,
            label: 'Change Password',
            href: '/admin/settings/reset-password',
        },
        {
            icon: Truck,
            label: 'Delivery Charge',
            href: '/admin/settings/delivery-charge',
        },
    ];

    return (
        <Fragment>
            <SectionLabel label={"Settings"}/>
            <div className="flex flex-col md:flex-row gap-2">
                {
                    NavItems.map((item, index) => (
                        <Link key={index}
                              href={item.href}
                              className="flex flex-col items-center justify-center bg-white h-[6rem] md:h-[12rem] w-full md:w-[12rem]
                           hover:scale-105 transition shadow  py-2 px-4 cursor-pointer border rounded-md"
                        >
                            <item.icon className="w-6 h-6 mr-2"/>
                            <span className="mt-2 text-bold text-sm text-slate-600">{item.label}</span>
                        </Link>
                    ))
                }
            </div>
        </Fragment>

    );
}