'use client'

import {useParams} from 'next/navigation';
import api from '@/lib/apiInstance';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const Customer = () => {

    const {customer_id} = useParams();

    return (
        <p>fa</p>
    );
}