'use client';

import {Fragment, useState} from 'react';
import useSWR from 'swr';
import {Pencil, PlusCircle, Trash, File, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {SimpleTable} from '@/components/SimpleTable';
import api from '@/lib/apiInstance';
import {ProductType} from '@/types/ProductType';
import {useToast} from '@/components/ui/use-toast';
import Modal from '@/components/Modal';
import {Skeleton} from '@/components/ui/skeleton';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Input} from '@/components/ui/input';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function Products() {

    const {toast} = useToast();
    const router = useRouter();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState('');
    const [search, setSearch] = useState('');
    const [searchedResults, setSearchedResults] = useState<ProductType[]>([]);
    const {
        data,
        isLoading,
        mutate
    } = useSWR<ProductType[]>('products', fetcher, {revalidateOnFocus: false});

    const deleteProduct = async () => {
        api.delete(`products/${selectedProductToDelete}`)
            .then(() => {
                mutate();
                toast({
                    title: 'Delete Successfully',
                    description: 'This category is deleted Successfully.',
                });
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => {
            setSelectedProductToDelete('');
            setOpenDeleteModal(false);
        });
    };

    const onSearch = () => {
        api.get(`/products/name/${search}`).then((response) => {
            setSearchedResults(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setSearch('');
            setSearchedResults([]);
            mutate();
        } else {
            setSearch(value);
        }
    };

    return (
        <Fragment>
            <SimpleTable
                title={'Products'}
                subTitle={'Manage your products and view their sales performance.'}
                actionItems={
                    <div className="flex justify-end items-center pb-2 w-full gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                value={search}
                                onChange={handleInput}
                                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                                placeholder="Search with product name"
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={'/admin/products/batch-upload'}
                                      className="flex items-center justify-between bg-slate-200 border border-slate-300 text-black px-3 py-2 rounded h-8 gap-1">
                                    <File className="h-3.5 w-3.5"/>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>{'Bulk Upload'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={'/admin/products/new'}
                                      className="flex items-center justify-between bg-black text-white px-3 py-2 rounded h-8 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5"/>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>{'Add Product'}</TooltipContent>
                        </Tooltip>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Company</TableHead>
                        <TableHead>Price(BDT)</TableHead>
                        <TableHead className="hidden md:table-cell">Stock</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
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
                        : searchedResults.length > 0 ? searchedResults?.map((product) => (
                            <TableRow key={product.productId} className={`${product.stock < 10 && 'bg-red-50'}`}>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={product.imageUrl}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {product.productName}
                                </TableCell>
                                <TableCell className="hidden md:table-cell capitalize">{product.brand.brandName}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant={'outline'}>
                                        {product.category.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Delete'}
                                                    onClick={() => {
                                                        router.push(`/admin/products/${product.productId}`);
                                                    }}>
                                                <Pencil size={15} color={'green'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Delete'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Delete'}
                                                    className="ml-1"
                                                    onClick={() => {
                                                        setSelectedProductToDelete(product.productId);
                                                        setOpenDeleteModal(true);
                                                    }}>
                                                <Trash size={15} color={'red'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Delete'}</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : data?.map((product) => (
                            <TableRow key={product.productId} className={`${product.stock < 10 && 'bg-red-50'}`}>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={product.imageUrl}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {product.productName}
                                </TableCell>
                                <TableCell className="hidden md:table-cell capitalize">{product.brand.brandName}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant={'outline'}>
                                        {product.category.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Delete'}
                                                    onClick={() => {
                                                        router.push(`/admin/products/${product.productId}`);
                                                    }}>
                                                <Pencil size={15} color={'green'}/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{'Delete'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'outline'} size={'icon'}
                                                    aria-label={'Delete'}
                                                    className="ml-1"
                                                    onClick={() => {
                                                        setSelectedProductToDelete(product.productId);
                                                        setOpenDeleteModal(true);
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

            <Modal isOpen={openDeleteModal} onClose={() => {
                setSelectedProductToDelete('');
                setOpenDeleteModal(false);
            }} title={'Delete Product'}>
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <div className="flex gap-2">
                        <Button onClick={deleteProduct}>Yes</Button>
                        <Button onClick={() => {
                            setSelectedProductToDelete('');
                            setOpenDeleteModal(false);
                        }}>No</Button>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}


