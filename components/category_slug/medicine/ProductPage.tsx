'use client';
import {SimilarProducts} from '@/components/category_slug/medicine/SimilarProducts';
import {ProductHero} from '@/components/category_slug/medicine/ProductHero';
import {ProductType} from '@/types/ProductType';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {SectionLabel} from '@/components/SectionLabel';
import {Fragment} from 'react';
import 'react-quill/dist/quill.snow.css';

type ProductPageProps = {
    data: ProductType | undefined,
    error: Error,
    isLoading: boolean,
};

export const ProductPage = (props: ProductPageProps) => {

    const {data, error, isLoading} = props;

    return (
        <section className="container py-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="col-span-1 md:col-span-2 pr-4">
                    {
                        error &&
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Sorry, there is something wrong with internet.
                            </AlertDescription>
                        </Alert>
                    }
                    {
                        isLoading
                            ? <div className="flex gap-4 md:gap-8">
                                <div
                                    className="h-[180px] md:h-[250px] w-[180px] md:w-[250px] rounded-lg p-4 border items-center flex justify-center">
                                    <Skeleton className="w-full h-full"/>
                                </div>
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <Skeleton className="h-6 md:h-8 w-3/4 mb-2"/>
                                        <Skeleton className="h-4 md:h-6 w-1/2"/>
                                    </div>
                                    <div>
                                        <div
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div className="mt-4">
                                                <Skeleton className="h-4 md:h-6 w-1/4 mb-1"/>
                                                <Skeleton className="h-4 md:h-6 w-1/4"/>
                                                <Skeleton className="h-4 md:h-6 w-1/4 mt-1"/>
                                            </div>
                                            <Skeleton className="h-8 w-24 mt-4 md:mt-0"/>
                                        </div>
                                        <Skeleton className="h-4 w-1/2 mt-2"/>
                                        <Skeleton className="h-4 w-1/2 mt-4"/>
                                    </div>
                                </div>
                            </div>
                            : <ProductHero product={data!}/>
                    }

                    <hr className="my-6"/>
                    {
                        data &&
                        <div className="mb-6">
                            <SimilarProducts
                                similarProductId={data.productId}
                            />
                        </div>
                    }
                </div>
                {/*<div className="pl-2 my-auto hidden md:block"*/}
                {/*     style={{*/}
                {/*         transform: 'translateY(-80%)'*/}
                {/*     }}>*/}
                {/*    <div className="p-4 mt-4 border-2 rounded-lg bg-teal-50 border-dashed">*/}
                {/*        <p className="text-sm text-slate-800 font-semibold mb-2">Offers Just for you</p>*/}
                {/*        <ul className="text-sm font-normal text-slate-700">*/}
                {/*            <li>Get extra 10% off</li>*/}
                {/*            <li>Get free delivery on first delivery</li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div>
                {
                    data?.ingredients &&
                    <Fragment>
                        <SectionLabel label={'Ingredients'}/>
                        <div
                            className="ql-editor"
                            dangerouslySetInnerHTML={{__html: data.ingredients}}/>
                    </Fragment>
                }
                {
                    data?.howToUse &&
                    <Fragment>
                        <SectionLabel label={'How To Use'}/>
                        <div
                            className="ql-editor"
                            dangerouslySetInnerHTML={{__html: data.howToUse}}/>
                    </Fragment>
                }
                {
                    data?.description &&
                    <Fragment>
                        <SectionLabel label={'Description'}/>
                        <div
                            className="ql-editor"
                            dangerouslySetInnerHTML={{__html: data.description}}/>
                    </Fragment>
                }

            </div>
        </section>
    );
};