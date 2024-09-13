'use client';

import {Fragment, useEffect, useState} from 'react';
import useSWR from 'swr';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import api from '@/lib/apiInstance';
import {SimpleTable} from '@/components/SimpleTable';
import {Button} from '@/components/ui/button';
import {Pencil} from 'lucide-react';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import {useToast} from '@/components/ui/use-toast';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Announcement} from '@/types/Announcement';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const Announcements = () => {

    const {toast} = useToast();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>();
    const [openAnnouncementFormModal, setOpenAnnouncementFormModal] = useState(false);
    const {
        data,
        isLoading,
        mutate,
    } = useSWR<Announcement>(`/announcement/${1}`, fetcher, {revalidateOnFocus: false});

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<Announcement>();

    const onSubmit: SubmitHandler<Announcement> = (data) => {
        const url = selectedAnnouncement ? `/announcement/${selectedAnnouncement.id}` : '/delivery-options';
        const method = selectedAnnouncement ? 'put' : 'post';

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
            setOpenAnnouncementFormModal(false);
            setSelectedAnnouncement(null);
            reset();
        });
    };

    useEffect(() => {
        if (selectedAnnouncement) {
            reset(selectedAnnouncement);
        } else {
            reset({});
        }
    }, [reset, selectedAnnouncement, setValue]);

    return (
        <Fragment>
            <SimpleTable
                title="Announcements"
                subTitle="Your Announcement Options"
                // actionItems={
                //     <div className="ml-auto pr-2 gap-1 flex flex-1 md:grow-0">
                //         <Button className="gap-2" onClick={() => {
                //             setOpenCountryFormModal(true);
                //             setSelectedAnnouncement(null);
                //             reset({});
                //         }}>
                //             <PlusCircle className="h-3.5 w-3.5"/>
                //             <span className="hidden md:block whitespace-nowrap text-sm">
                //                   Add Delivery
                //             </span>
                //         </Button>
                //     </div>
                // }
                tableHeader={
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="flex justify-end">Actions</TableHead>
                    </TableRow>
                }
                tableBody={
                    isLoading
                        ? <Fragment>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                    <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Skeleton className="h-6 w-3/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/2"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-1/4"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6"/>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                        : data &&
                        <TableRow key={data.id}>
                            <TableCell>{data.description}</TableCell>
                            <TableCell className="flex gap-1 justify-end">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={'outline'} size={'icon'}
                                                aria-label={'Accept this delivery'}
                                                onClick={() => {
                                                    setSelectedAnnouncement(data);
                                                    setOpenAnnouncementFormModal(true);
                                                }}>
                                            <Pencil size={15} color={'green'}/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{'Edit'}</TooltipContent>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                }
            />
            <Modal isOpen={openAnnouncementFormModal} onClose={() => {
                setSelectedAnnouncement(null);
                setOpenAnnouncementFormModal(false);
            }} title={'Announcement Form'}>
                {
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
                                                checked={value}
                                                onChange={onChange}
                                            />
                                      </div>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
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
                }
            </Modal>
        </Fragment>
    );
};