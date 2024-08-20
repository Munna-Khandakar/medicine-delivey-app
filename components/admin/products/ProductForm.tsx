'use client';

import * as React from 'react';
import {useState} from 'react';
import Image from 'next/image';
import {useForm, SubmitHandler} from 'react-hook-form';
import ReactQuill from 'react-quill';
import {format} from 'date-fns';
import {CalendarIcon} from '@radix-ui/react-icons';
import 'react-quill/dist/quill.snow.css';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ImageUploader} from '@/components/common/ImageUploader';
import {ErrorLabel} from '@/components/common/ErrorLabel';

type Inputs = {
    id: string;
    name: string;
    price: number;
    image: [];
    category_id: string;
    discount?: number;
    brand: string;
    expires: string;
    countryOfOrigin?: string;
    description?: string;
    howToUse?: string;
    ingredients?: string;
    stock: number;
    coupons: []
}

export const ProductForm = () => {

    const [value, setValue] = useState('');
    const [date, setDate] = useState<Date>();

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

    return (
        <form
            className={cn('grid items-start gap-4 grid-cols-1 md:grid-cols-3')}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>
                            User will get these details in the product page
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    className="w-full"
                                    placeholder="medicine name"
                                    {...register('name', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.name && <ErrorLabel message={errors.name.message!}/>
                                }
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description">Description</Label>
                                <div className="">
                                    <ReactQuill
                                        value={value}
                                        onChange={(value) => setValue(value)}
                                        placeholder="medicine the descriptions"
                                        style={{
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="grid gap-3">
                                <Label htmlFor="price">Price(BDT)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    className="w-full"
                                    placeholder="BDT"
                                    {...register('price', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.price && <ErrorLabel message={errors.price.message!}/>
                                }
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="discount">Discount (BDT)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    className="w-full"
                                    placeholder="BDT"
                                    {...register('discount', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.discount && <ErrorLabel message={errors.discount.message!}/>
                                }
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="discount">Available in Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    className="w-full"
                                    placeholder=""
                                    {...register('stock', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.stock && <ErrorLabel message={errors.stock.message!}/>
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Manufacturing Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="grid gap-3">
                                <Label htmlFor="category">Manufactured Company</Label>
                                <Select>
                                    <SelectTrigger id="category" aria-label="Select category">
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clothing">Square Ltd</SelectItem>
                                        <SelectItem value="electronics">ACI Ltd</SelectItem>
                                        <SelectItem value="accessories">Acme Pharmaceuticals Ltd</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="subcategory">Expires In (Date)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-[240px] justify-start text-left font-normal',
                                                !date && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="category">Origin</Label>
                                <Select>
                                    <SelectTrigger id="category" aria-label="Select category">
                                        <SelectValue placeholder="Select Country"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clothing">Bangladesh</SelectItem>
                                        <SelectItem value="electronics">India</SelectItem>
                                        <SelectItem value="accessories">China</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                            Lipsum dolor sit amet, consectetur adipiscing elit
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Image
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="300"
                                src="/placeholder.svg"
                                width="300"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <button>
                                    <Image
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="84"
                                        src="/placeholder.svg"
                                        width="84"
                                    />
                                </button>
                                <button>
                                    <Image
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="84"
                                        src="/placeholder.svg"
                                        width="84"
                                    />
                                </button>
                               <ImageUploader/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit" className="w-full mt-4">Save</Button>
            </div>
        </form>
    );
};