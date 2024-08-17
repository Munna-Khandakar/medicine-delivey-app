'use client';

import React, {Fragment, useState} from 'react';
import Link from 'next/link';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ProceedToLogin} from '@/components/Signup/ProceedToLogin';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import './Signup.css';
import {UserRole} from '@/types/UserRole';

type Inputs = {
    userName: string
    password: string
    role: string
}

export function SignupForm() {

    const {toast} = useToast();
    const [steps, setSteps] = useState(0);
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: {errors}
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        data.role = UserRole.USER;
        api.post('/reg/login', data).then(() => {
            setRegistrationSuccessful(true);
        }).catch((error) => {
            toast({
                title: error.name,
                description: error.message,
            });
        }).finally(() => {
            setSteps(0);
        });
    };

    const nextForm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (steps == 1) {
            return setRegistrationSuccessful(true);
        }
        trigger(['userName', 'password']).then((valid) => {
            if (valid) {
                setSteps(p => p + 1);
            }
        });
    };
    const previousForm = () => {
        setSteps(p => p - 1);
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {
                registrationSuccessful
                    ? <ProceedToLogin/>
                    : <Card className="max-w-sm md:max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">Signup</CardTitle>
                            <CardDescription>
                                Welcome to Pharmatic. Your participation can make others life beautiful
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-4">
                                    {
                                        steps == 0 &&
                                        <Fragment>
                                            <div className="grid gap-2">
                                                <Label htmlFor="userName">Phone Number</Label>
                                                <Input
                                                    id="userName"
                                                    type="text"
                                                    placeholder="01XXXXXXXXX"
                                                    {...register('userName', {required: 'Please enter your phone number'})}
                                                />
                                                {
                                                    errors?.userName && <ErrorLabel message={errors.userName.message!}/>
                                                }
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">Password</Label>
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
                                        </Fragment>
                                    }
                                    {
                                        steps == 1 &&
                                        <Fragment>
                                            <div className="grid gap-2">
                                                <Label htmlFor="fullname">OTP</Label>
                                                <p className="text-xs font-normal text-slate-500">Please check your phone
                                                    for OTP. </p>
                                                <InputOTP maxLength={4}>
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
                                                </InputOTP>

                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms" defaultChecked={true}/>
                                                <Label htmlFor="terms">Accept terms and conditions</Label>
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="flex gap-2">
                                        {
                                            steps > 0 &&
                                            <Button type="button" variant="secondary" className="w-full"
                                                    onClick={previousForm}>
                                                Back
                                            </Button>
                                        }
                                        {
                                            steps != 1
                                                ? <Button type="button" variant="default" className="w-full"
                                                          onClick={nextForm}>
                                                    Next
                                                </Button>
                                                : <Button type="submit" variant="default" className="w-full">
                                                    Register
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{' '}
                                <Link href={'/login'} className="underline">
                                    Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
            }

        </div>
    );
}
