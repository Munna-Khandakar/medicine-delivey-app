'use client';

import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {Fragment, useEffect, useState} from 'react';
import {SimpleTable} from '@/components/SimpleTable';
import {Button} from '@/components/ui/button';
import {Pencil, PlusCircle, Trash} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Brand} from '@/types/Brand';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const BrandsPage = () => {

    const {toast} = useToast();
    const [selectedCountry, setSelectedCountry] = useState<Brand | null>();
    const [openCountryFormModal, setOpenCountryFormModal] = useState(false);
    const [openCountryDeleteModal, setOpenCountryDeleteModal] = useState(false);
    const {
        data,
        isLoading,
        mutate,
    } = useSWR<Brand[]>('brands', fetcher, {revalidateOnFocus: false});

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<Brand>();

    const onSubmit: SubmitHandler<Brand> = (data) => {
        const url = selectedCountry ? `/brands/${selectedCountry.id}` : '/brands';
        const method = selectedCountry ? 'put' : 'post';

        api[method](url, data).then(() => {
            mutate().then(() => {
                toast({
                    title: 'Successful',
                    description: `Brand ${selectedCountry ? 'updated' : 'added'} successfully`,
                });
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.name,
                description: error.message,
            });
        }).finally(() => {
            setOpenCountryFormModal(false);
            setSelectedCountry(null);
            reset();
        });
    };

    const deleteCountry = () => {
        if (selectedCountry) {
            api.delete(`/brands/${selectedCountry.id}`).then(() => {
                mutate().then(() => {
                    toast({
                        title: 'Successful',
                        description: 'Brand deleted successfully',
                    });
                });
            }).catch((error) => {
                console.log(error);
                toast({
                    title: error.data.name,
                    description: error.data.message,
                });
            }).finally(() => {
                setOpenCountryDeleteModal(false);
                setSelectedCountry(null);
            });
        }
    };

    useEffect(() => {
        if (selectedCountry) {
            reset(selectedCountry);
        } else {
            reset({});
        }
    }, [reset, selectedCountry, setValue]);

    return (
        <Fragment>
            <SimpleTable
                title="Brands"
                subTitle="List of all brands"
                actionItems={
                    <div className="ml-auto pr-2 gap-1 flex flex-1 md:grow-0">
                        <Button className="gap-2" onClick={() => {
                            setOpenCountryFormModal(true);
                            setSelectedCountry(null);
                            reset({});
                        }}>
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="hidden md:block whitespace-nowrap text-sm">
                                  Add Brand
                            </span>
                        </Button>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Product Count</TableHead>
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
                        : data?.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell>{brand.id}</TableCell>
                                <TableCell>{brand.brandName}</TableCell>
                                <TableCell>{brand.totalProductCount}</TableCell>
                                <TableCell className="flex gap-1 justify-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Accept this brand'}
                                                    onClick={() => {
                                                        setSelectedCountry(brand);
                                                        setOpenCountryFormModal(true);
                                                    }}>
                                                <Pencil size={15} color={'green'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Edit'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Cancel this brand'}
                                                    disabled={brand.totalProductCount > 0}
                                                    onClick={() => {
                                                        setSelectedCountry(brand);
                                                        setOpenCountryDeleteModal(true);
                                                    }}>
                                                <Trash size={15} color={'red'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Delete'}</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                }
            />
            <Modal isOpen={openCountryFormModal} onClose={() => {
                setSelectedCountry(null);
                setOpenCountryFormModal(false);
            }} title={'Brand Form'}>
                {
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="brandName">Brand Name</Label>
                                <Input
                                    id="brandName"
                                    type="text"
                                    placeholder="brand"
                                    {...register('brandName', {required: 'Please enter brand name'})}
                                />
                                {
                                    errors?.brandName && <ErrorLabel message={errors.brandName.message!}/>
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

            <Modal isOpen={openCountryDeleteModal} onClose={() => {
                setSelectedCountry(null);
                setOpenCountryDeleteModal(false);
            }} title={'Delete Brand'}>
                {
                    selectedCountry
                    && <div>
                        <div className="text-lg font-normal">Are you sure you want to cancel this brand?</div>
                        <div className="flex gap-2 mt-4">
                            <Button variant={'outline'} onClick={() => {
                                setOpenCountryDeleteModal(false);
                            }}>No</Button>
                            <Button onClick={() => {
                                setOpenCountryDeleteModal(false);
                                deleteCountry();
                            }}>
                                Yes</Button>
                        </div>
                    </div>
                }
            </Modal>
        </Fragment>
    );
};