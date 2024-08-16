import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {Cookie} from '@/utils/Cookie';


interface ApiInstance extends AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
}

const backend_url  = 'https://13d8-61-247-182-213.ngrok-free.app/pharmatica';

const api: ApiInstance = axios.create({
    baseURL: `${backend_url}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookie.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
