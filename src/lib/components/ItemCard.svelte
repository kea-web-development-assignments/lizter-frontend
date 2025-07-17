<script>
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { ItemImage } from '$lib/components';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    export let _id;
    export let slug;
    export let name;
    export let releaseDate;
    export let description;
    export let cover = '';
    export let images;
    export let type;
    export let tags;
    export let showDeleteButton;
    export let showUpdateButton;
    export let showRemoveButton;

    const dispatch = createEventDispatcher();

    async function removeItemFromList() {
        const response = await api.delete(`/me/lists/${$page.params.name}/items/${_id}`);
        const { data } = response;

        if(data.error?.message) {
            alert(`Failed to remove item from list: ${data.error?.message}`);
            return;
        }

        dispatch('change');
        await invalidateAll();
    }
</script>

<a
    href={`/items/${type}/${slug}`}
    class="w-[20rem] min-w-[0] flex flex-col bg-slate-200 text-black rounded-md duration-200 hover:transform hover:-translate-y-1"
    data-sveltekit-preload-data="tap"
>
    <ItemImage
        src={cover}
        alt={name}
    />
    <section class="flex-1 max-h-44 p-3 flex flex-col gap-2">
        <section class="flex-1">
            <h3 class="text-lg font-bold text-ellipsis overflow-hidden text-nowrap mb-1">{name}</h3>
            <p class="text-ellipsis overflow-hidden line-clamp-3">{description}</p>
        </section>
        {#if showRemoveButton}
            <section class="flex justify-end text-lg">
                <button
                    class="w-3/5 bg-rose-500 text-white text-center rounded-lg cursor-pointer p-1"
                    on:click|stopPropagation|preventDefault={removeItemFromList}
                >
                    Remove from list
                </button>
            </section>
        {/if}
    </section>
</a>
