import { goto } from '$app/navigation';
import { createRequester } from '$lib/utils/apiRequester';

export async function load(event) {
    const { code } = event.params;
    const api = createRequester();

    const response = await api.post('/verify-account', { code });
    const { data } = response;

    if(data?.error?.message) {
        alert(`Failed to verify your account: ${data.error.message}`);
        goto('/login');
        return;
    }

    alert('Your account has been verified!');
    goto('/login');
}
