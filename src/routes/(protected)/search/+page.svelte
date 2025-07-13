<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { ItemCard, SearchBar, InputField, MultiSelectField, Paginator } from '$lib/components';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let mounted = false;
    let searchQuery = '';
    let selectedItemTypes = [];
    let selectedTags = [];
    let from;
    let to;
    let count = 0;
    let start = 0;
    let limit = 30;
    let currentPage = 1;
    let searchPromise = search();
    
    async function search() {
        const searchObject = {
            searchQuery,
            tags: JSON.stringify(selectedTags),
            types: JSON.stringify(selectedItemTypes),
            from,
            to,
            start,
            limit,
            currentPage,
        };
        
        Object.keys(searchObject).forEach(key => {
            if (searchObject[key] === '' || searchObject[key] === '[]' || searchObject[key] === undefined) {
                delete searchObject[key];
            }
        });

        const searchParams = new URLSearchParams(searchObject);
        if(mounted) {
            goto(`?${searchParams.toString()}`, {replaceState: true, noScroll: true, keepFocus: true})
        }

        const response = await api.get(`/items?${searchParams.toString()}`);
        const { data } = response;

        if(response?.error?.message) {
            return {
                error: { message: `Failed to search items: ${response.error.message}` }
            }
        }

        if(!isNaN(parseInt(data.count))) {
            count = parseInt(data.count);
        }

        return data;
    }

    function startSearch() {
        searchPromise = search();
    }

    onMount(() => {
        mounted = true;
        const urlParams = Object.fromEntries($page.url.searchParams);

        if(urlParams.searchQuery) {
            searchQuery = urlParams.searchQuery;
        }
        if(urlParams.tags) {
            selectedTags = JSON.parse(urlParams.tags);
        }
        if(urlParams.types) {
            selectedItemTypes = JSON.parse(urlParams.types);
        }
        if(urlParams.from) {
            from = new Date(urlParams.from)?.toISOString().split('T')[0];
        }
        if(urlParams.to) {
            to = new Date(urlParams.to)?.toISOString().split('T')[0];
        }
        if (urlParams.start) {
            start = parseInt(urlParams.start);
        }
        if (urlParams.limit) {
            limit = parseInt(urlParams.limit);
        }
        if (urlParams.currentPage) {
            currentPage = parseInt(urlParams.currentPage);
        }

        searchPromise = search();
    });
</script>

<svelte:head>
    <title>Search | Lizter</title>
</svelte:head>

<section class="h-full w-full flex flex-col">
    <section class="w-full justify-items-center p-4">
        <SearchBar
            placeholder="Search..."
            bind:query={searchQuery}
            on:search={startSearch}
        />
        <section class="w-full flex flex-wrap justify-center gap-4 p-4">
            <section class="flex-1 flex flex-wrap justify-center gap-4 md:justify-end">
                <MultiSelectField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    label="Tags"
                    options={$page.data?.tags?.map((tag) => tag.name)}
                    bind:selected={selectedTags}
                    on:change={startSearch}
                />
                <MultiSelectField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    label="Item types"
                    options={$page.data?.itemTypes?.map((itemType) => itemType.name)}
                    bind:selected={selectedItemTypes}
                    on:change={startSearch}
                />
            </section>
            <section class="flex-1 flex flex-wrap justify-center gap-4 md:justify-start">
                <InputField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    type="date"
                    label="From"
                    bind:value={from}
                    on:change={startSearch}
                />
                <InputField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    type="date"
                    label="To"
                    bind:value={to}
                    on:change={startSearch}
                />
            </section>
        </section>
    </section>
    <section class="h-fit w-full flex flex-wrap justify-center gap-4">
        {#await searchPromise}
            <p class="text-xl text-center font-bold p-10">Searching for items...</p>
        {:then data}
            {#if data.error}
                <p class="text-xl text-center font-bold p-10">{data.error.message}</p>
            {:else}
                {#if data.items?.length}
                    {#each data.items as item}
                        <ItemCard {...item} />
                    {/each}
                {:else}
                    <p class="text-xl text-center font-bold p-10">No items found</p>
                {/if}
            {/if}
        {/await}
    </section>
    <Paginator
        totalItems={count}
        {limit}
        bind:start={start}
        bind:currentPage={currentPage}
        on:change={startSearch}
    />
</section>
