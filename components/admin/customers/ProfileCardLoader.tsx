import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Label} from '@/components/ui/label';

export const ProfileCardLoader = () => {
    return (
        <Card className="rounded">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-1/4"/>
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-1/2"/>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Label htmlFor="userName">Profile Picture</Label>
                <div className={'w-[6rem] rounded-full h-[6rem] mx-auto border'}>
                    <Skeleton className="h-full w-full rounded-full"/>
                </div>
                <Label htmlFor="userName">Name</Label>
                <Skeleton className="h-8 w-full"/>
                <Label htmlFor="phoneNumber">Phone</Label>
                <Skeleton className="h-8 w-full"/>
                <Label htmlFor="address">Address</Label>
                <Skeleton className="h-8 w-full"/>
            </CardContent>
            <CardFooter className="justify-end">
                <Skeleton className="h-10 w-24"/>
            </CardFooter>
        </Card>
    );
};