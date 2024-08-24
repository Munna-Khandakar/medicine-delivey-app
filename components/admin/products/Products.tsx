'use client';
import {Fragment, useState} from 'react';
import useSWR from 'swr';
import Image from 'next/image';

import {MoreHorizontal, PlusCircle, Search} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {SimpleTable} from '@/components/SimpleTable';
import Revital from '@/components/medicine/revital.webp';
import Link from 'next/link';
import api from '@/lib/apiInstance';
import {ProductResponse} from '@/types/ProductResponse';
import {useToast} from '@/components/ui/use-toast';
import Modal from '@/components/Modal';

const productsFetcher = (url: string) => api.get(url).then((res) => res.data);


export function Products() {

    const {toast} = useToast();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState('');
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<ProductResponse[]>('products', productsFetcher, {revalidateOnFocus: false});

    const deleteProduct = () => {
        api.delete(`${'products'}/${selectedProductToDelete}`)
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

    {
        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error</p>;
    }

    return (
        <Fragment>
            <SimpleTable
                title={'Products'}
                subTitle={'Manage your products and view their sales performance.'}
                actionItems={
                    <div className="flex justify-end items-center pb-2 w-full">
                        <div className="relative ml-auto pr-2 flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                        <Link href={'/admin/products/new'}
                              title="Add Product"
                              className="flex items-center justify-between bg-black text-white px-3 py-2 rounded h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="hidden md:block whitespace-nowrap text-sm">
                                  Add Product
                            </span>
                        </Link>
                    </div>
                }
                tableHeader={
                    <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Composition</TableHead>
                        <TableHead className="hidden md:table-cell">Company</TableHead>
                        <TableHead>Price(BDT)</TableHead>
                        <TableHead className="hidden md:table-cell">
                            Type
                        </TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                }
                tableBody={
                    data?.map((product) => (
                        <TableRow key={product.productId}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={Revital}
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.productName}
                            </TableCell>
                            {/*<TableCell className="hidden md:table-cell">{product.composition}</TableCell>*/}
                            <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant={'outline'}>{product.categoryId}</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4"/>
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Button variant="destructive" onClick={() => {
                                                setSelectedProductToDelete(product.productId);
                                                setOpenDeleteModal(true);
                                            }}>Delete</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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


