import {ReactNode} from 'react';
import {Inter} from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import {Navbar} from '@/components/Navbar/Navbar';
import {Footer} from '@/components/Footer';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export default function RootLayout({children}: Readonly<{ children: ReactNode; }>) {
    return (
        <html lang="en">
        <head>
            <title>PHARMATIC | Beyond Medication</title>
            <link rel="icon" href="/icon.ico" sizes="any"/>
            <link
                rel="icon"
                href="/icon.ico?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
        </head>
        <body className={inter.className}>
        <Navbar/>
        <main>
            {children}
        </main>
        <Toaster />
        <Footer/>
        </body>
        </html>
    );
}
