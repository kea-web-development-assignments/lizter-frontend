import { browser } from "$app/environment"
import { goto } from "$app/navigation"

export async function load() {
    if (browser && localStorage.getItem('role') !== 'admin') {
        alert('You are unauthorized to access this page.');
        goto('/search');
    }
}
