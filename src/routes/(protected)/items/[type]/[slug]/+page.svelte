<script>
    import { page } from '$app/stores';
    import { ItemImage, InputField } from '$lib/components';
    import { invalidateAll } from '$app/navigation';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    $: images = $page.data.item?.images?.length ? $page.data.item?.images : [$page.data.item?.cover].filter(Boolean);
    $: currentList = $page.data.lists?.find((list) => list.name === $page.data.item?.list);
    $: currentListItem = currentList?.items?.find((listItem) => listItem.item === $page.data.item?._id)

    let currentImageIndex = 0;

    function previousImage() {
        if(!images.length) {
            return;
        }
        if((currentImageIndex - 1) < 0) {
            currentImageIndex = images.length - 1;
            return;
        }

        currentImageIndex -= 1;
    }
    function nextImage() {
        if(!images.length) {
            return;
        }
        if((currentImageIndex + 1) >= images.length) {
            currentImageIndex = 0;
            return;
        }

        currentImageIndex += 1;
    }

    async function addToList() {
        const list = $page.data.lists.find((list) => list.itemType === $page.data.item.type);

        if(!list) {
            alert(`You have no list with the type ${$page.data.item.type}, please create one and then add the item to the list again.`);
        }

        const response = await api.post(`/me/lists/${list.name}/items`, {
            itemId: $page.data.item._id,
        });
        const { data } = response;

        if(data.error?.message) {
            alert(`Failed to add item to list: ${data.error?.message}`);
            return;
        }

        await invalidateAll();
    }
    async function update(updateData) {
        const response = await api.patch(`/me/lists/${$page.data.item.list}/items/${$page.data.item._id}`, updateData);
        const { data } = response;

        if(data.error?.message) {
            alert(`Failed to update list item: ${data.error?.message}`);
            return;
        }

        await invalidateAll();
    }
    async function removeFromList() {
        const response = await api.delete(`/me/lists/${$page.data.item.list}/items/${$page.data.item._id}`);
        const { data } = response;

        if(data.error?.message) {
            alert(`Failed to remove item from list: ${data.error?.message}`);
            return;
        }

        await invalidateAll();
    }
</script>

<svelte:head>
    <title>{$page.data.item.name} | {$page.data.item.type} | Lizter</title>
</svelte:head>

<section class="h-full w-full flex flex-col gap-4 xl:[display:grid_!important] [grid-template-areas:'title_images''content_images''content_images'] grid-cols-2">
    <section class="xl:h-full flex justify-center items-end">
        <h1 class="[grid-area:title] text-4xl font-bold text-center line-clamp-2 md:text-ellipsis md:overflow-hidden">
            {$page.data.item.name}
        </h1>
    </section>
    <section class="[grid-area:images] w-full flex flex-col gap-4 p-2 xl:mt-20">
        <ul class="w-full relative flex justify-center items-center text-black">
            {#each images.length ? images : [''] as image, index}
                <li
                    class="w-full relative flex items-center"
                    class:flex={currentImageIndex === index}
                    class:hidden={currentImageIndex !== index}
                >
                    <button
                        class="w-7 h-7 absolute flex items-center justify-center bg-white text-xl rounded-full left-2 p-2 z-10"
                        on:click={previousImage}
                    >
                        &#10094;
                    </button>
                    <ItemImage
                        elementClass="max-h-[30rem] w-full object-cover rounded-md"
                        src={image}
                        alt={`${$page.data.item.name} image`}
                    />
                    <button
                        class="w-7 h-7 absolute flex items-center justify-center bg-white text-xl rounded-full right-2 p-2 z-10"
                        on:click={nextImage}
                    >
                        &#10095;
                    </button>
                </li>
            {/each}
        </ul>
        {#if $page.data.item.list}
            <section class="w-full flex gap-2">
                <select
                    class="w-full bg-gray-200 text-black border border-gray-400 rounded-sm p-2"
                    value={$page.data.item.list}
                    on:change={(e) => update({ newListName: e.target.value })}
                >
                    {#each $page.data.lists?.filter((list) => list.itemType === $page.data.item.type) as list}
                        <option value="{list.name}">{list.name}</option>
                    {/each}
                </select>
                <InputField
                    type="number"
                    containerClass="w-14"
                    textCenter
                    hideArrows
                    value={currentListItem?.rating}
                    on:change={(e) => update({ rating: e.target.value })}
                />
            </section>
            <button
                class="w-full bg-rose-500 color-white text-lg text-center font-bold rounded-lg p-3 cursor-pointer"
                on:click={removeFromList}
            >
                Remove from list
            </button>
        {:else}
            <button
                class="w-full bg-blue-500 color-white text-lg text-center font-bold rounded-lg p-3 cursor-pointer"
                on:click={addToList}
            >
                Add to list
            </button>
        {/if}
    </section>
    <section class="[grid-area:content] w-full flex flex-col gap-8">
        <section>
            <h2 class="text-2xl">Description</h2>
            <p class="whitespace-pre-line mt-2">
                {$page.data.item.description}
            </p>
        </section>
        <section class="w-full grid grid-cols-2 gap-4">
            {#each Object.entries({
                type: $page.data.item.type,
                tags: $page.data.item.tags,
                "release Date": new Date($page.data.item.releaseDate).toLocaleDateString(),
                ...($page.data.item.meta ?? {}),
            }) as [ sectionLabel, sectionData ]}
                <section>
                    <h3 class="font-bold capitalize">{sectionLabel}</h3>
                    <p>
                        {#if Array.isArray(sectionData)}
                            {#each sectionData as data, i}
                                {#if i < sectionData.length - 1}
                                    <a class="underline" href={`/search?${sectionLabel.replaceAll(' ', '')}=["${data}"]`}>
                                        {data}
                                    </a>, &nbsp;
                                {:else}
                                    <a class="underline" href={`/search?${sectionLabel.replaceAll(' ', '')}=["${data}"]`}>
                                        {data}
                                    </a>
                                {/if}
                            {/each}
                        {:else}
                            {#if sectionData}
                                <a class="underline" href={`/search?${sectionLabel.replaceAll(' ', '')}="${sectionData}"`}>
                                    {sectionData}
                                </a>
                            {:else}
                                Unknown
                            {/if}
                        {/if}
                    </p>
                </section>
            {/each}
        </section>
    </section>
</section>
