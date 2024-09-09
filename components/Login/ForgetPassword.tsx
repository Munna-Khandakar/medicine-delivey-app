'use client';
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

type Inputs = {
    phoneNumber: string
}

export function ForgetPasswordForm() {

    const {toast} = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        api.post('/auth/forget-password', data).then(() => {
            toast({
                title: 'A temporary password has been sent to your phone number',
                description: 'Use that password to login to your account',
            });
            router.push('/');

        }).catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className=" max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forget Password</CardTitle>
                    <CardDescription>
                        An temporary password will be sent to your phone number
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
                            <Button type="submit" className="w-full">
                                Send
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Login to your account{' '}
                        <Link href={'/login'} className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
