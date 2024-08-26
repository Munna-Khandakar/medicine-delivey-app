'use client';
import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Cookie} from '@/utils/Cookie';

type Inputs = {
    phoneNumber: string
    password: string
}

export function LoginForm() {

    const {toast} = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        api.post('/auth/login', data).then((response) => {
            console.log(response.data);
            Cookie.set('token', response.data.accessToken);
            if (Cookie.isAdmin()) {
                router.push('/admin');
            }
            router.push('/profile');

        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    useEffect(() => {
        Cookie.clearCookies();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className=" max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your phone number below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    {...register('phoneNumber', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.phoneNumber && <ErrorLabel message={errors.phoneNumber.message!}/>
                                }
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="***"
                                    {...register('password', {required: 'Please enter your password'})}
                                />
                                {
                                    errors?.password && <ErrorLabel message={errors.password.message!}/>
                                }
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href={'/signup'} className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
