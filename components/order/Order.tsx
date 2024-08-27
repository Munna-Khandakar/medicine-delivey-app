'use client';

import {useParams} from 'next/navigation';
import OrderDetailsSLip from '@/components/admin/common/OrderDetailsSLip';

export default function Order() {
    const {orderId} = useParams();
    const processedOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
    return (
        <OrderDetailsSLip orderId={processedOrderId}/>
    );
}
