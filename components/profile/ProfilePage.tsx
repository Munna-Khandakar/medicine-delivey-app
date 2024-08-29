'use client';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {Cookie} from '@/utils/Cookie';
import {User} from '@/types/User';
import {LocalStorageKeys, LocalStorageUtils} from '@/utils/LocalStorageUtils';

type Inputs = {
    userName: string;
    address: string;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const ProfilePage = () => {

    const {toast} = useToast();
    const [ownUserId, setOwnUserId] = useState<string | null>(null);
    const router = useRouter();

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<User>(ownUserId ? `users/${ownUserId}` : null, fetcher, {revalidateOnFocus: false});

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (ownUserId) {
            api.put(`/users/${ownUserId}`, data).then((response) => {
                mutate();
                toast({
                    title: 'Successful',
                    description: 'Profile updated successfully',
                });
                const redirect = LocalStorageUtils.getItem('redirect');
                if (redirect) {
                    LocalStorageUtils.removeItem('redirect');
                    router.push(redirect);
                }
            }).catch((error) => {
                toast({
                    title: error.response.data.code,
                    description: error.response.data.message,
                });
            });
        }
    };


    useEffect(() => {
        const id = Cookie.getMyUserId();
        if (id) setOwnUserId(id);
    }, []);

    useEffect(() => {
        if (data) {
            reset();
            setValue('userName', data.userName);
            setValue('address', data.address);
        }
    }, [data, setValue, reset]);


    return (
        <section className="container mx-auto h-screen max-w-full md:max-w-[60%]">
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Used to identify your store in the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Label htmlFor="userName">Name</Label>
                        {
                            isLoading
                                ? <Skeleton className="w-full h-[2rem] rounded"/>
                                : <Input
                                    id="userName"
                                    type="text"
                                    className="w-full"
                                    placeholder="name"
                                    {...register('userName', {required: 'Please enter your name'})}
                                />
                        }
                        {
                            errors?.userName && <ErrorLabel message={errors.userName.message!}/>
                        }
                        <Label htmlFor="address">Address</Label>
                        {
                            isLoading
                                ? <Skeleton className="w-full h-[2rem] rounded"/>
                                : <Input
                                    id="address"
                                    type="text"
                                    className="w-full"
                                    placeholder="address"
                                    {...register('address', {required: 'Please enter your address'})}
                                />
                        }
                        {
                            errors?.address && <ErrorLabel message={errors.address.message!}/>
                        }
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 justify-end">
                        <Button type={isDirty ? 'submit' : 'button'} variant={isDirty ? 'default' : 'outline'}>
                            Save
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
};
