'use client';

import {TotalUserChart} from '@/components/admin/dashboard/TotalUserChart';
import {WeeklySales} from '@/components/admin/dashboard/WeeklySales';
import {TotalSalesChart} from '@/components/admin/dashboard/TotalSales';
import {ProductCountChart} from '@/components/admin/dashboard/ProductCountChart';
import {OngoingOrders} from '@/components/admin/dashboard/OngoingOrders';
import {AnnouncementSettings} from '@/components/admin/dashboard/AnnouncementSettings';

export function DashboardPage() {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    <TotalUserChart/>
                    <WeeklySales/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    <TotalSalesChart/>
                    <OngoingOrders/>
                </div>
            </div>
            <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                    <ProductCountChart/>
                    <AnnouncementSettings/>
                </div>
            </div>
        </div>
    );
}
