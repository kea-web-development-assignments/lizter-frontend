import axios from 'axios';
import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * @param {{
 *  alertFatal: Boolean,
 * }} options
 */
export function createRequester(options = { alertFatal: true }) {
    const api = axios.create({
        baseURL: PUBLIC_API_URL,
        validateStatus: (_) => true, // don't throw errors on bad status codes
    });

    api.interceptors.request.use((config) => {
        if (browser && localStorage.getItem('token')) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        }

        return config;
    });
    api.interceptors.response.use((response) => {
        if(options.alertFatal && response.status === 500 && response.data?.reason === 'Internal Server Error') {
            alert('Something went wrong, try again later.');
            return response;
        }

        return response;
    });

    return api;
}
