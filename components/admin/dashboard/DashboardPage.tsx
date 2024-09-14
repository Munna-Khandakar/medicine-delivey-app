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
                    <CirularChart length={data?.totalUsers || 0} label="Total Users"/>
                    <WeeklySales/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    <CirularChart length={data?.totalOrders || 0} label="Total Orders"/>
                    <OngoingOrders/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    <CirularChart length={data?.totalProducts || 0} label="Total Products"/>
                    <AnnouncementSettings/>
                </div>
            </div>
        </div>
    );
}
