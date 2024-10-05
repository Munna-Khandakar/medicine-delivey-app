import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {Cookie} from '@/utils/Cookie';

const DEFAULT_API = 'https://pharmatic.co/pharmatica';

interface ApiInstance extends AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
}

const backend_url: string = process.env.NEXT_PUBLIC_API || DEFAULT_API;

const api: ApiInstance = axios.create({
    baseURL: `${backend_url}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
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

const refreshToken = async () => {
    try {
        const response = await axios.post(`${backend_url}/api/auth/refresh-token`, {
            'refreshToken': Cookie.getRefreshToken(),
        });
        Cookie.setToken(response.data.accessToken);
        Cookie.setRefreshToken(response.data.refreshToken);
        return response.data.accessToken;
    } catch (error) {
        console.error('Failed to refresh token', error);
        Cookie.remove('token');
        Cookie.remove('refreshToken');
        window.location.href = '/login';
        return null;
    }
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;