import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {Cookie} from '@/utils/Cookie';


interface ApiInstance extends AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
}

const backend_url: string = 'https://8d61-61-247-182-213.ngrok-free.app/pharmatica';

const api: ApiInstance = axios.create({
    baseURL: `${backend_url}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookie.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default api;
