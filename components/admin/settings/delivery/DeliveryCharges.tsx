'use client';

import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {Country} from '@/types/Country';
import {Fragment, useEffect, useState} from 'react';
import {SimpleTable} from '@/components/SimpleTable';
import {Button} from '@/components/ui/button';
import {Pencil, PlusCircle} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {DeliveryType} from '@/types/DeliveryType';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const DeliveryCharges = () => {

    const {toast} = useToast();
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>();
    const [openCountryFormModal, setOpenCountryFormModal] = useState(false);
    const {
        data,
        isLoading,
        mutate,
    } = useSWR<DeliveryType[]>('/delivery-options', fetcher, {revalidateOnFocus: false});

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<DeliveryType>();

    const onSubmit: SubmitHandler<DeliveryType> = (data) => {
        const url = selectedDelivery ? `/delivery-options/${selectedDelivery.id}` : '/delivery-options';
        const method = selectedDelivery ? 'put' : 'post';

        api[method](url, data).then(() => {
            mutate().then(() => {
                toast({
                    title: 'Successful',
                    description: `Product ${selectedDelivery ? 'updated' : 'added'} successfully`,
                });
            });
        }).catch((error) => {
            toast({
                title: error.response.data.name,
                description: error.response.data.message,
            });
        }).finally(() => {
            setOpenCountryFormModal(false);
            setSelectedDelivery(null);
            reset();
        });
    };

    useEffect(() => {
        if (selectedDelivery) {
            reset(selectedDelivery);
        } else {
            reset({});
        }
    }, [reset, selectedDelivery, setValue]);

    return (
        <Fragment>
            <SimpleTable
                title="Delivery Options"
                subTitle="List of all delivery options"
                actionItems={
                    <div className="ml-auto pr-2 gap-1 flex flex-1 md:grow-0">
                        <Button className="gap-2" onClick={() => {
                            setOpenCountryFormModal(true);
                            setSelectedDelivery(null);
                            reset({});
                        }}>
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="hidden md:block whitespace-nowrap text-sm">
                                  Add Delivery
                            </span>
                        </Button>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rate</TableHead>
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
                        : data?.map((delivery) => (
                            <TableRow key={delivery.id}>
                                <TableCell>{delivery.title}</TableCell>
                                <TableCell>{delivery.rate}</TableCell>
                                <TableCell>{delivery.description}</TableCell>
                                <TableCell className="flex gap-1 justify-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Accept this delivery'}
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setOpenCountryFormModal(true);
                                                    }}>
                                                <Pencil size={15} color={'green'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Edit'}</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                }
            />
            <Modal isOpen={openCountryFormModal} onClose={() => {
                setSelectedDelivery(null);
                setOpenCountryFormModal(false);
            }} title={'Country Form'}>
                {
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Delivery Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="description"
                                    {...register('title', {required: 'Please enter title'})}
                                />
                                {
                                    errors?.title && <ErrorLabel message={errors.title.message!}/>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Delivery Rate</Label>
                                <Input
                                    id="rate"
                                    type="number"
                                    placeholder="rate"
                                    {...register('rate', {required: 'Please enter rate'})}
                                />
                                {
                                    errors?.rate && <ErrorLabel message={errors.rate.message!}/>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
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