'use client';

import {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';
import {UserRole} from '@/types/enum/UserRole';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {USER_REG_STATUS} from '@/types/enum/UserResitrationStatus';
import api from '@/lib/apiInstance';
import {useToast} from '@/components/ui/use-toast';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import { Key } from "lucide-react"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

type Inputs = {
    phoneNumber: string
    password: string
    otpCode: string
    role: UserRole
}

export const CreateAdminForm = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [userResitrationStatus, setUserResitrationStatus] = useState<USER_REG_STATUS | ''>('');

    const {
        register,
        control,
        handleSubmit,
        getValues,
        reset,
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

    const otpVerify: SubmitHandler<Inputs> = async (data) => {
        const otpPayload = {
            phoneNumber: data.phoneNumber,
            otpCode: data.otpCode,
        };
        api.post('/otp/verify', otpPayload).then(() => {
            toast({
                title: 'OTP verified',
                description: 'You are now verified',
            });
            setUserResitrationStatus(USER_REG_STATUS.OTP_VERIFIED);
        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        api.post('/reg/user-status', data).then((response) => {
            const registrationStatus = response.data.status;
            if (registrationStatus === USER_REG_STATUS.REGISTERED) {
                toast({
                    title: 'User already exists',
                    description: 'Sorry we can not create a new user with this phone number',
                });
            } else if (registrationStatus === USER_REG_STATUS.OTP_VERIFIED) {
                toast({
                    title: 'OTP verified',
                    description: 'This phone number is already verified',
                });
                setUserResitrationStatus(USER_REG_STATUS.OTP_VERIFIED);
            } else if (registrationStatus === USER_REG_STATUS.NOT_REGISTERED) {
                setUserResitrationStatus(USER_REG_STATUS.NOT_REGISTERED);
                sendOTP(data.phoneNumber).then(() => {
                    toast({
                        title: 'OTP send',
                        description: 'please check your phone for OTP',
                    });
                });
            } else {
                toast({
                    title: 'Something went wrong',
                    description: 'Please try again',
                });
            }

        }).catch((error) => {
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    const onRegistrationSubmit: SubmitHandler<Inputs> = async (data) => {
        const otpPayload = {
            phoneNumber: data.phoneNumber,
            password: data.phoneNumber,
            role: UserRole.ADMIN,
        };
        api.post('/reg/login', otpPayload).then(() => {
            router.push('/admin/settings/admin');
            toast({
                title: 'Admin created',
                description: 'Phone number is the password of the admin',
            });
        }).catch((error) => {
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a new Admin</CardTitle>
                <CardDescription>Admin need to change his password. Default password is his phone
                    number</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => e.preventDefault()}>
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
                        {
                            userResitrationStatus === USER_REG_STATUS.NOT_REGISTERED &&
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">OTP</Label>
                                <p className="text-xs font-normal text-slate-500">Please check your phone
                                    for OTP. <span className="ml-4 text-end text-black" role="button"
                                                   onClick={() => {
                                                       sendOTP(getValues('phoneNumber'));
                                                   }}>Resend</span></p>
                                <Controller
                                    name="otpCode"
                                    control={control}
                                    defaultValue=""
                                    render={({field}) => (
                                        <InputOTP maxLength={6} {...field}>
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
                                    )}
                                />
                            </div>
                        }
                        {
                            userResitrationStatus === USER_REG_STATUS.OTP_VERIFIED &&
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Alert>
                                    <Key className="h-4 w-4" />
                                    <AlertTitle>Thinking about password?</AlertTitle>
                                    <AlertDescription>
                                        Password is the phone number of the admin. Admin need to change his password
                                    </AlertDescription>
                                </Alert>
                            </div>
                        }
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" type={'button'}
                        onClick={() => {
                            reset();
                            setUserResitrationStatus('');
                            router.push('/admin/settings/admin');
                        }}>Cancel</Button>
                {
                    userResitrationStatus === USER_REG_STATUS.NOT_REGISTERED &&
                    <Button onClick={handleSubmit(otpVerify)}>Verify OTP</Button>
                }
                {
                    userResitrationStatus === USER_REG_STATUS.OTP_VERIFIED &&
                    <Button onClick={handleSubmit(onRegistrationSubmit)}>Create</Button>
                }
                {
                    userResitrationStatus === '' &&
                    <Button onClick={handleSubmit(onSubmit)}>Send OTP</Button>
                }
            </CardFooter>

        </Card>
    );
};