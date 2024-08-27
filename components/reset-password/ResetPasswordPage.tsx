'use client';

import {SubmitHandler, useForm} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';

type Inputs = {
    oldPassword: string;
    newPassword: string;
}

export const ResetPasswordPage = () => {

    const {toast} = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isDirty},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
            api.post(`/auth/updatePassword`, data).then((response) => {
                toast({
                    title: 'Successful',
                    description: 'Password updated successfully',
                });
                reset();
            }).catch((error) => {
                toast({
                    title: error.response.data.code,
                    description: error.response.data.message,
                });
            });
    };

    return (
        <section className="container mx-auto h-screen max-w-full md:max-w-[60%]">
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Update Password</CardTitle>
                        <CardDescription>
                            You can update your password from here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            className="w-full"
                            placeholder="current password"
                            {...register('oldPassword', {required: 'Please enter your current password'})}
                        />
                        {
                            errors?.oldPassword && <ErrorLabel message={errors.oldPassword.message!}/>
                        }
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            className="w-full"
                            placeholder="new passowrd"
                            {...register('newPassword', {required: 'Please enter your address'})}
                        />
                        {
                            errors?.newPassword && <ErrorLabel message={errors.newPassword.message!}/>
                        }
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 justify-end">
                        <Button type={isDirty ? 'submit' : 'button'} variant={isDirty ? 'default' : 'outline'}>
                            Update
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
};
