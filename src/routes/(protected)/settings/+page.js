import { createRequester } from '$lib/utils/apiRequester';

export async function load() {
    const api = createRequester();

    const response = await api.get('/me');
    const { data } = response;

    if(data?.error?.message) {
        alert(`Failed to get account info: ${data.error.message}`);
        return;
    }

    return { user: data };
}
