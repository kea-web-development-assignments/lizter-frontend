<script>
    import { onMount } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { ItemForm, ItemCard, Modal, SearchBar, InputField, SelectField, TextAreaField, MultiSelectField, ImagePicker, Paginator } from '$lib/components';
    import { itemValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let form;
    let formError = {};
    let showModal = false;

    let mounted = false;
    let searchQuery = '';
    let count = 0;
    let start = 0;
    let limit = 30;
    let currentPage = 1;
    let searchPromise = search();

    async function addItem() {
        formError = {};
        const itemData = new FormData(form);

        if(itemData.get('releaseDate')) {
            itemData.set('releaseDate', new Date(itemData.get('releaseDate')).toISOString());
        }

        if(itemData.get('tags')) {
            const selectedTags = JSON.parse(itemData.get('tags'));
            itemData.delete('tags');

            for (const tag of selectedTags) {
                itemData.append('tags[]', tag);
            }
        }

        const response = await api.post(`/items`, itemData);
        const { data } = response;

        if(data.error) {
            formError = data.error;
            return;
        }

        showModal = false;
        startSearch();
        await invalidateAll();
    }

    async function search() {
        const searchObject = {
            searchQuery,
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
            searchQuery = urlParams.query;
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
    <title>Manage Items | Lizter</title>
</svelte:head>

<section class="h-full w-full flex flex-col items-center mt-4">
    <section class="w-full flex flex-col gap-4 justify-between p-2 mb-8 sm:flex-row">
        <h1 class="text-5xl">Manage Items</h1>
        <button
            class="bg-primary text-white font-bold px-4 py-2 rounded cursor-pointer"
            on:click={() => showModal = true}
        >+ Add Item</button>
    </section>
    <SearchBar
        placeholder="Search..."
        bind:query={searchQuery}
        on:search={startSearch}
    />
    <section class="h-fit w-full flex flex-wrap justify-center gap-4 mt-8">
        {#await searchPromise}
            <p class="text-xl text-center font-bold p-10">Searching for items...</p>
        {:then data}
            {#if data.error?.message}
                <p class="text-xl text-center font-bold p-10">{data.error.message}</p>
            {:else}
                {#if data.items?.length}
                    {#each data.items as item}
                        <ItemCard
                            {...item}
                            showUpdateButton
                            showDeleteButton
                            on:change={startSearch}
                        />
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

<Modal
    bind:showModal={showModal}
    on:close={() => showModal = false}
>
    <ItemForm
        bind:thisForm={form}
        submitText="Add Item"
        errorMessage={formError?.message}
        onSubmit={addItem}
        on:close={() => showModal = false}
    >
        <InputField
            name="name"
            label="Name"
            errorMessage={formError?.fields?.name}
            required
            {...itemValidation.name}
        />
        <SelectField
            name="type"
            label="Type"
            errorMessage={formError?.fields?.type}
            required
        >
            {#each $page.data.itemTypes as itemType}
                <option value={itemType.name}>{itemType.name}</option>
            {/each}
        </SelectField>
        <TextAreaField
            name="description"
            label="Description"
            errorMessage={formError?.fields?.description}
            required
            {...itemValidation.description}
        />
        <InputField
            type="date"
            name="releaseDate"
            label="Release date"
            errorMessage={formError?.fields?.releaseDate}
            {...itemValidation.releaseDate}
        />
        <ImagePicker
            name="cover"
            label="Cover"
            errorMessage={formError?.fields?.cover}
        />
        <ImagePicker
            name="images[]"
            label="Images"
            errorMessage={formError?.fields?.images}
            multiple
        />
        <MultiSelectField
            name="tags"
            label="Tags"
            options={$page.data.tags?.map(tag => tag.name)}
            errorMessage={formError?.fields?.tags}
        />
    </ItemForm>
</Modal>
