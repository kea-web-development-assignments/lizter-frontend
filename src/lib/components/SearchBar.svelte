<script>
    import { SubmitButton } from '$lib/components';
    import { createEventDispatcher } from 'svelte';

    export let query = '';
    export let placeholder = '';
    export let debounceDelay = 500;

    const dispatch = createEventDispatcher();
    let timer;

    function debounceSearch() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            dispatch('search', { query });
        }, debounceDelay);
    }

    function search() {
        dispatch('search', { query });
    }
</script>

<form on:submit|preventDefault={search} class="max-w-[40rem] w-full flex flex-col gap-2 sm:flex-row">
    <input
        class="w-full bg-white text-black border border-gray-400 rounded-full p-2"
        type="text"
        {placeholder}
        bind:value={query}
        on:input={debounceSearch}
    />
    <SubmitButton addToStyle="sm:w-24" text="Search" />
</form>
