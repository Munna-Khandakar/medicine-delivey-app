'use client';

import {TotalUserChart} from '@/app/admin/dashboard/TotalUserChart';
import {WeeklySales} from '@/app/admin/dashboard/WeeklySales';
import {TotalSalesChart} from '@/app/admin/dashboard/TotalSales';
import {ProductCountChart} from '@/app/admin/dashboard/ProductCountChart';
import {OngoingOrders} from '@/app/admin/dashboard/OngoingOrders';

export function DashboardPage() {
    return (
        <div
            className="grid grid-cols-3 gap-2">
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
                </div>
            </div>
        </div>
    );
}
