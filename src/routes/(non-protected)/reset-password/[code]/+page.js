import { goto } from '$app/navigation';
import { createRequester } from '$lib/utils/apiRequester';

export async function load(event) {
    const { code } = event.params;
    const api = createRequester();

    const response = await api.post(`/reset-password/${code}/verify`);
    const { data } = response;

    if(data?.error?.message) {
        alert(`Failed to validate reset code: ${data.error.message}`);
        goto('/login');
    }
}
