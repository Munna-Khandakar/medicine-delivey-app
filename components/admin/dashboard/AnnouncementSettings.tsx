import {Card, CardContent, CardHeader} from '@/components/ui/card';
import useSWR from 'swr';
import {Announcement} from '@/types/Announcement';
import api from '@/lib/apiInstance';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {useToast} from '@/components/ui/use-toast';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';

const fetcher = (url: string) => api.get(url).then((res) => res.data);
const DEFAULT_ANNOUNCEMENT_ID = 1;


export const AnnouncementSettings = () => {

    const {toast} = useToast();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>();

    const {
        data,
        isLoading,
        mutate,
    } = useSWR<Announcement>(`/announcement/${DEFAULT_ANNOUNCEMENT_ID}`, fetcher, {revalidateOnFocus: false});


    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors, isDirty},
    } = useForm<Announcement>();

    const onSubmit: SubmitHandler<Announcement> = (data) => {
        const url = `/announcement/${DEFAULT_ANNOUNCEMENT_ID}`;
        const method = 'put';

        api[method](url, data).then(() => {
            mutate().then(() => {
                toast({
                    title: 'Successful',
                    description: `Announcement ${selectedAnnouncement ? 'updated' : 'added'} successfully`,
                });
            });
        }).catch((error) => {
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedAnnouncement(null);
            reset();
        });
    };

    useEffect(() => {
        if (data) {
            reset(data);
        } else {
            reset({});
        }
    }, [reset, data]);

    if (isLoading) {
        return <AnnouncementSettingsLoader />;
    }

    return (
        <Card>
            <CardHeader className="text-2xl font-semibold">Your Announcement</CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Controller
                                control={control}
                                name="enabled"
                                render={({field: {onChange, value}}) => (
                                    <div className="flex justify-between">
                                        <Label htmlFor="enabled">Enabled</Label>
                                        <Switch
                                            id="enabled"
                                            aria-label={'announcement enabled'}
                                            checked={value}
                                            onCheckedChange={onChange}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                aria-label={'announcement description'}
                                placeholder="title"
                                {...register('description', {required: 'Please enter description'})}
                            />
                            {
                                errors?.description && <ErrorLabel message={errors.description.message!}/>
                            }
                        </div>
                        <Button variant={isDirty ? 'default' : 'secondary'} disabled={!isDirty} type="submit"
                                className="w-full">
                            Save
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const AnnouncementSettingsLoader = () => {
    return (
        <Card>
            <CardHeader className="text-2xl font-semibold">
                <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-6 w-10" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
};