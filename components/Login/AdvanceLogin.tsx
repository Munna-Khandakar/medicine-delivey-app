'use client';
import React, {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useSearchParams} from 'next/navigation';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Cookie} from '@/utils/Cookie';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';

type Inputs = {
    phoneNumber: string
    password: string
}

enum USER_REG_STATUS {
    REGISTERED = 'REGISTERED',
    NOT_REGISTERED = 'NOT_REGISTERED',
}

export function AdvanceLogin() {

    const {toast} = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const phoneNumber = searchParams.get('phoneNumber');

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<Inputs>();

    const sendOTP = async (phoneNumber: string) => {
        return api.post('/otp/send', {phoneNumber})
            .then((response) => {
                console.log(response);
                return true;
            })
            .catch((error) => {
                toast({
                    title: error.response.data.code,
                    description: error.response.data.message,
                });
                return false;
            });
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        api.post('/reg/user-status', data).then((response) => {
            const registrationStatus = response.data.status;
            if (registrationStatus === USER_REG_STATUS.REGISTERED) {
                router.push(`?status=${USER_REG_STATUS.REGISTERED}&phoneNumber=${data.phoneNumber}`);
            } else {
                sendOTP(data.phoneNumber).then((response) => {
                    router.push(`?status=${USER_REG_STATUS.NOT_REGISTERED}&phoneNumber=${data.phoneNumber}`);
                });
            }

        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    const onLoginSubmit: SubmitHandler<Inputs> = async (data) => {
        api.post('/auth/login', data).then((response) => {
            Cookie.setToken(response.data.accessToken);
            Cookie.setRefreshToken(response.data.refreshToken);
            if (Cookie.isAdmin()) {
                router.push('/admin');
            }
            router.push('/');

        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    const otpVerify: SubmitHandler<Inputs> = async (data) => {
        api.post('/otp/verify', data).then((response) => {
            // if verify then take password and register

        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    useEffect(() => {
        if (phoneNumber) {
            setValue('phoneNumber', phoneNumber);
        }
    }, [phoneNumber, setValue]);

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
                    {
                        !status &&
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
                                <Button type="submit" className="w-full">
                                    Next
                                </Button>
                            </div>
                        </form>
                    }
                    {
                        status === USER_REG_STATUS.REGISTERED &&
                        <form onSubmit={handleSubmit(onLoginSubmit)}>
                            <div className="grid gap-4">
                                <div className="hidden">
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
                    }
                    {
                        status === USER_REG_STATUS.NOT_REGISTERED &&
                        <form onSubmit={handleSubmit(onLoginSubmit)}>
                            <div className="grid gap-4">
                                <div className="hidden">
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
                                    <Label htmlFor="fullname">OTP</Label>
                                    <p className="text-xs font-normal text-slate-500">Please check your phone
                                        for OTP. </p>
                                    <InputOTP maxLength={6}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={1}/>
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={2}/>
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3}/>
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4}/>
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={5}/>
                                        </InputOTPGroup>
                                    </InputOTP>

                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </form>
                    }
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
