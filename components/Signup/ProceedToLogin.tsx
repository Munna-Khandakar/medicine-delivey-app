import Link from 'next/link';
import Image from 'next/image';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import PartyImage from "./party.png"

export const ProceedToLogin = () => {
    return (
        <Card className="max-w-sm md:max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Congratulation!</CardTitle>
                <CardDescription>
                    Your account has been created successfully. Login to your dashboard and start your journey with
                    Donate
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="flex items-center justify-center">
                        <div className="h-[100px] w-[100px] bg-fuchsia-50 rounded-full">
                            <Image src={PartyImage} alt={'party'}/>
                        </div>
                    </div>
                    <Link href={'/login'} className="border px-1 py-2 font-medium text-sm rounded-md bg-black text-white  text-center">Proceed To Login</Link>
                </div>
            </CardContent>
        </Card>
    );
};