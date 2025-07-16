import { createRequester } from '$lib/utils/apiRequester';

export async function load(event) {
    const { type, slug } = event.params
    const api = createRequester();

    const response = await api.get(`/items/${type}/${slug}`);
    const { data } = response;

    if(data?.error?.message) {
        alert(`Failed to get item: ${data.error.message}`);
        return;
    }

    return { item: data?.item };
}
