import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const ProductFormSkeleton = () => {
    return (
        <form className="grid items-start gap-4 grid-cols-1 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Skeleton className="h-40 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Skeleton className="h-10 w-full mt-4" />
            </div>
        </form>
    );
};