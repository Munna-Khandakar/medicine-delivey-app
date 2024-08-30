'use client';

import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {Country} from '@/types/Country';
import {Fragment, useEffect, useState} from 'react';
import {SimpleTable} from '@/components/SimpleTable';
import {Button} from '@/components/ui/button';
import {Pencil, PlusCircle, Trash} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import Modal from '@/components/Modal';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useToast} from '@/components/ui/use-toast';
import {Label} from '@/components/ui/label';
import {ErrorLabel} from '@/components/common/ErrorLabel';
import {Category} from '@/types/Category';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {ImageUploader} from '@/components/common/ImageUploader';


const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CategoriesPage = () => {

    const {toast} = useToast();
    const [imageUrl, setImageUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>();
    const [openCategoryFormModal, setOpenCategoryFormModal] = useState(false);
    const [openCategoryDeleteModal, setOpenCategoryDeleteModal] = useState(false);
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR<Category[]>('categories', fetcher, {revalidateOnFocus: false});

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<Category>();

    const onSubmit: SubmitHandler<Category> = (data) => {
        const url = selectedCategory ? `/categories/${selectedCategory.id}` : '/categories/create';
        const method = selectedCategory ? 'put' : 'post';

        api[method](url, data).then(() => {
            mutate().then(() => {
                toast({
                    title: 'Successful',
                    description: `Categories ${selectedCategory ? 'updated' : 'added'} successfully`,
                });
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.name,
                description: error.message,
            });
        }).finally(() => {
            setOpenCategoryFormModal(false);
            setSelectedCategory(null);
            reset();
        });
    };

    const deleteCountry = () => {
        if (selectedCategory) {
            api.delete(`/categories/${selectedCategory.id}`).then(() => {
                mutate().then(() => {
                    toast({
                        title: 'Successful',
                        description: 'Categories deleted successfully',
                    });
                });
            }).catch((error) => {
                console.log(error);
                toast({
                    title: error.data.name,
                    description: error.data.message,
                });
            }).finally(() => {
                setOpenCategoryDeleteModal(false);
                setSelectedCategory(null);
            });
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            reset(selectedCategory);
            setValue('iconUrl', selectedCategory.iconUrl);
        } else {
            reset({});
        }
    }, [reset, selectedCategory, setValue]);

    return (
        <Fragment>
            <SimpleTable
                title="Categories"
                subTitle="List of all categories"
                actionItems={
                    <div className="ml-auto pr-2 gap-1 flex flex-1 md:grow-0">
                        <Button className="gap-2" onClick={() => {
                            setOpenCategoryFormModal(true);
                            setSelectedCategory(null)
                            reset({});
                        }}>
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="hidden md:block whitespace-nowrap text-sm">
                                  Add Category
                            </span>
                        </Button>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead>Name</TableHead>
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
                        : data?.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.label}</TableCell>
                                <TableCell className="flex gap-1 justify-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Accept this category'}
                                                    onClick={() => {
                                                        setSelectedCategory(category);
                                                        setOpenCategoryFormModal(true);
                                                    }}>
                                                <Pencil size={15} color={'green'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Edit'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Cancel this category'}
                                                    onClick={() => {
                                                        setSelectedCategory(category);
                                                        setOpenCategoryDeleteModal(true);
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
            <Modal isOpen={openCategoryFormModal} onClose={() => {
                setSelectedCategory(null);
                setOpenCategoryFormModal(false);
            }} title={'Category Form'}>
                {
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="label">Name</Label>
                                <Input
                                    id="label"
                                    type="text"
                                    placeholder="label"
                                    {...register('label', {required: 'Please enter category label'})}
                                />
                                {
                                    errors?.label && <ErrorLabel message={errors.label.message!}/>
                                }
                            </div>
                            <div className="col-span-1">
                                <Card className="overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Icon</CardTitle>
                                        <CardDescription>
                                            Upload Icon for the category
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <Controller
                                                name="iconUrl"
                                                control={control}
                                                render={({field}) => (
                                                    <ImageUploader
                                                        onUploadComplete={(url) => {
                                                            field.onChange(url);
                                                            setImageUrl(url);
                                                        }}
                                                        imageUrl={imageUrl}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>


                            <Button variant={isDirty ? 'default' : 'secondary'} disabled={!isDirty} type="submit"
                                    className="w-full">
                                Save
                            </Button>
                        </div>
                    </form>
                }
            </Modal>

            <Modal isOpen={openCategoryDeleteModal} onClose={() => {
                setSelectedCategory(null);
                setOpenCategoryDeleteModal(false);
            }} title={'Delete Country'}>
                {
                    selectedCategory
                    && <div>
                        <div className="text-lg font-normal">Are you sure you want to cancel this country?</div>
                        <div className="flex gap-2 mt-4">
                            <Button variant={'outline'} onClick={() => {
                                setOpenCategoryDeleteModal(false);
                            }}>No</Button>
                            <Button onClick={() => {
                                setOpenCategoryDeleteModal(false);
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