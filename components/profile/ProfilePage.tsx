'use client';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {LocalStorageUtils} from '@/utils/LocalStorageUtils';

type Inputs = {
    name: string;
    address: number;
}
export const ProfilePage = () => {

    const {toast} = useToast();
    const router = useRouter();
    const [ownUserId, setOwnUserId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        // if (ownUserId) {
        //     api.post(`/users/${ownUserId}`, data).then((response) => {
        //         router.push('/profile');
        //         toast({
        //             title: 'Successful',
        //             description: 'Profile updated successfully',
        //         });
        //     }).catch((error) => {
        //         console.log(error);
        //         toast({
        //             title: error.name,
        //             description: error.message,
        //         });
        //     });
        // }

        LocalStorageUtils.setProfile(data);
        toast({
            title: 'Successful',
            description: 'Profile updated successfully',
        });
        router.push('/checkout');
    };

    useEffect(() => {
        setOwnUserId(LocalStorageUtils.getProfile().id);
    }, [setOwnUserId]);

    useEffect(() => {
        const profile = LocalStorageUtils.getProfile();
        if (profile) {
            reset();
            setValue('name', profile.name);
            setValue('address', profile.address);
        }
    }, [setValue, reset]);

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
                    <CardContent>

                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            className="w-full"
                            placeholder="name"
                            {...register('name', {required: 'Please enter your name'})}
                        />
                        {
                            errors?.name && <ErrorLabel message={errors.name.message!}/>
                        }
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            className="w-full"
                            placeholder="address"
                            {...register('address', {required: 'Please enter your address'})}
                        />
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
