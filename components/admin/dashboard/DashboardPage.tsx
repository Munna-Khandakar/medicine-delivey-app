'use client';

import {WeeklySales} from '@/components/admin/dashboard/WeeklySales';
import {OngoingOrders} from '@/components/admin/dashboard/OngoingOrders';
import {AnnouncementSettings} from '@/components/admin/dashboard/AnnouncementSettings';
import useSWR from 'swr';
import api from '@/lib/apiInstance';
import {CirularChart} from '@/components/admin/dashboard/CircularChart';

const fetcher = (url: string) => api.get(url).then((res) => res.data);


export function DashboardPage() {

    const {
        data,
        isLoading,
        mutate
    } = useSWR<any>('/report/summary-details', fetcher, {revalidateOnFocus: false});

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    {
                        isLoading
                            ? <CircularChartSkeleton/>
                            : <CirularChart length={data?.totalUsers || 0} label="Total Users"/>
                    }
                    <WeeklySales/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    {
                        isLoading
                            ? <CircularChartSkeleton/>
                            : <CirularChart length={data?.totalOrders || 0} label="Total Orders"/>
                    }
                    <OngoingOrders/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    {
                        isLoading
                            ? <CircularChartSkeleton/>
                            : <CirularChart length={data?.totalProducts || 0} label="Total Products"/>
                    }
                    <AnnouncementSettings/>
                </div>
            </div>
        </div>
    );
}

import {Card, CardContent} from '@/components/ui/card';

export function CircularChartSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
                    <div className="animate-pulse">
                        <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
                        <div className="mt-4 h-4 w-32 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
