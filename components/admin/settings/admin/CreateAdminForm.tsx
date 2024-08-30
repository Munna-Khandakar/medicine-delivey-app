'use client';

import {UserRole} from '@/types/enum/UserRole';
import {Button} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {USER_REG_STATUS} from '@/types/enum/UserResitrationStatus';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import api from '@/lib/apiInstance';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import React from 'react';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';


type Inputs = {
    phoneNumber: string
    password: string
    otpCode: string
    role: UserRole
}

export const CreateAdminForm = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [userResitrationStatus, setUserResitrationStatus] = React.useState<USER_REG_STATUS | ''>('');

    const {
        register,
        control,
        handleSubmit,
        getValues,
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
        api.post('/otp/verify', otpPayload).then((response) => {
            router.push(`?status=${USER_REG_STATUS.OTP_VERIFIED}`);
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
                router.push(`?status=${USER_REG_STATUS.REGISTERED}&phoneNumber=${data.phoneNumber}`);
            } else if (registrationStatus === USER_REG_STATUS.OTP_VERIFIED) {
                router.push(`?status=${USER_REG_STATUS.OTP_VERIFIED}&phoneNumber=${data.phoneNumber}`);
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

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Create a new Admin</CardTitle>
                <CardDescription>Admin need to change his password. Default password is his phone
                    number</CardDescription>
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
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                {
                    userResitrationStatus === '' &&
                    <Button>Send OTP</Button>
                }

            </CardFooter>
        </Card>
    );
};