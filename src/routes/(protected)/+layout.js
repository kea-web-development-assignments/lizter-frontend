import { browser } from "$app/environment"
import { goto } from "$app/navigation"
import { createRequester } from '$lib/utils/apiRequester';

export async function load(event) {
    const { url } = event;

    if (browser && !localStorage.getItem('token')) {
        goto(`/login?redirectTo=${url.pathname}`);
        return;
    }

    const api = createRequester();

    const response = await api.get('/me');
    const { data } = response;

    if(response?.error?.message) {
        alert(`Failed to get user lists: ${response.error.message}`);
        return;
    }

    return { lists: data.lists };
}
