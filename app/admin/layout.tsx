import {Metadata} from 'next';
import {AdminNavbar} from '@/components/Navbar/AdminNavbar';
import {TooltipProvider} from '@/components/ui/tooltip';
import {AdminHeader} from '@/components/admin/common/AdminHeader';

export const metadata: Metadata = {
    title: 'Admin | Pharmatic',
    description: 'Medicine 24/7',
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <TooltipProvider>
                <AdminNavbar/>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <AdminHeader/>
                    <main
                        className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        {children}
                    </main>
                </div>
            </TooltipProvider>
        </div>

    );
}
