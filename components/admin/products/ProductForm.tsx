'use client';

import {useEffect, useState} from 'react';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import {format} from 'date-fns';
import {CalendarIcon} from '@radix-ui/react-icons';

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
import api from '@/lib/apiInstance';
import useSWR from 'swr';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {Category} from '@/types/Category';
import {ProductInput, ProductType} from '@/types/ProductType';
import 'react-quill/dist/quill.snow.css';
import {Brand} from '@/types/Brand';
import {Country} from '@/types/Country';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

type ProductFormProps = {
    product?: ProductType
}

export const ProductForm = (props: ProductFormProps) => {

    const {product} = props;
    const [date, setDate] = useState<Date>();

    const [imageUrl, setImageUrl] = useState('');
    const {toast} = useToast();
    const router = useRouter();
    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesLoading
    } = useSWR<Category[]>('categories', fetcher, {revalidateOnFocus: false});

    const {
        data: brands,
        error: brandsError,
        isLoading: brandsLoading
    } = useSWR<Brand[]>('brands', fetcher, {revalidateOnFocus: false});

    const {
        data: countries,
        error: countriesError,
        isLoading: countriesLoading
    } = useSWR<Country[]>('countries', fetcher, {revalidateOnFocus: false});

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm<ProductInput>();

    const onSubmit: SubmitHandler<ProductInput> = (data) => {
        const url = product ? `/products/${product.productId}` : '/products/create';
        const method = product ? 'put' : 'post';

        api[method](url, data).then((response) => {
            router.push('/admin/products');
            toast({
                title: 'Successful',
                description: `Product ${product ? 'updated' : 'added'} successfully`,
            });
        }).catch((error) => {
            console.log(error);
            toast({
                title: error.name,
                description: error.message,
            });
        });
    };

    useEffect(() => {
        if (product) {
            setDate(new Date(product.expires));
            setImageUrl(product.imageUrl);
            reset(product);
            setValue('categoryId', product.category.id);
            setValue('brandId', product.brand.id);
            setValue('countryId', product.country.id);
        }
    }, [product, reset]);


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
                                <Label htmlFor="productName">Name</Label>
                                <Input
                                    id="productName"
                                    type="text"
                                    className="w-full"
                                    placeholder="medicine name"
                                    {...register('productName', {required: 'Please enter your phone number'})}
                                />
                                {
                                    errors?.productName && <ErrorLabel message={errors.productName.message!}/>
                                }
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description">Description</Label>
                                <div className="">
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({field: {value, onChange}}) => (
                                            <ReactQuill
                                                value={value}
                                                onChange={onChange}
                                                placeholder="medicine the descriptions"
                                                style={{
                                                    maxHeight: '200px',
                                                    overflowY: 'auto',
                                                }}
                                            />
                                        )}
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
                                <Label htmlFor="categoryId">Category</Label>
                                {
                                    categoriesLoading && <p>Loading...</p>
                                }
                                {
                                    categoriesError && <p>Error...</p>
                                }
                                {
                                    categories &&
                                    <Controller
                                        name="categoryId"
                                        control={control}
                                        render={({field: {value, onChange}}) => {
                                            const selectedCategory = categories.find(category => category.id === value);
                                            return (
                                                <Select onValueChange={onChange} value={value}>
                                                    <SelectTrigger id="categoryId" aria-label="Select category">
                                                        <SelectValue>{selectedCategory ? selectedCategory.label : 'Select category'}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                }

                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="countryOfOrigin">Country</Label>
                                {
                                    countriesLoading && <p>Loading...</p>
                                }
                                {
                                    countriesError && <p>Error...</p>
                                }
                                {
                                    countries &&
                                    <Controller
                                        name="countryId"
                                        control={control}
                                        render={({field: {value, onChange}}) => {
                                            const selectedCountry = countries.find(country => country.id === value);
                                            return (
                                                <Select onValueChange={onChange} value={value}>
                                                    <SelectTrigger id="countryId" aria-label="Select Country">
                                                        <SelectValue>{selectedCountry ? selectedCountry.countryName : 'Select Country'}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            countries.map((country) => (
                                                                <SelectItem key={country.id}
                                                                            value={country.id}>
                                                                    {country.countryName}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                }

                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="brand">Brand</Label>
                                {
                                    brandsLoading && <p>Loading...</p>
                                }
                                {
                                    brandsError && <p>Error...</p>
                                }
                                {
                                    brands &&
                                    <Controller
                                        name="brandId"
                                        control={control}
                                        render={({field: {value, onChange}}) => {
                                            const selectedBrand = brands.find(brand => brand.id === value);
                                            return (
                                                <Select onValueChange={onChange} value={value}>
                                                    <SelectTrigger id="brandId" aria-label="Select Brand">
                                                        <SelectValue>{selectedBrand ? selectedBrand.brandName : 'Select Brand'}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            brands.map((brand) => (
                                                                <SelectItem key={brand.id}
                                                                            value={brand.id}>{brand.brandName}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                }

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
                                        <Controller
                                            name="expires"
                                            control={control}
                                            render={({field: {onChange}}) => (
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(date) => {
                                                        setDate(date);
                                                        onChange(date);
                                                    }}
                                                    initialFocus
                                                />
                                            )}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                        <CardDescription>
                           Upload image of the product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Controller
                                name="imageUrl"
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
                <Button
                    type="submit" className="w-full mt-4"
                    disabled={!isDirty}
                    variant={isDirty ? 'default' : 'secondary'}
                >
                    Save
                </Button>
            </div>
        </form>
    );
};