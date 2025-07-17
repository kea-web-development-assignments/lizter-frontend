
import { createRequester } from '$lib/utils/apiRequester';

export async function load(event) {
    const { name } = event.params;

    const api = createRequester();

    const response = await api.get(`/me/lists/${name}`);
    const { data } = response;

    if (data?.error) {
        return { error: data.error };
    }

    return { list: data.list };
}
