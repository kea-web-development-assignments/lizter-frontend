<script>
    import { page } from '$app/stores';
    import { ItemCard } from '$lib/components';
</script>

<svelte:head>
    <title>{$page.data.list.name} | Lizter</title>
</svelte:head>

<section class="h-full w-full flex flex-col">
    <section class="h-fit w-full flex flex-wrap justify-center gap-4">
        {#if $page.data.list.items?.length}
            {#each $page.data.list.items as listItem}
                <ItemCard
                    {...listItem.item}
                    showRemoveButton
                />
            {/each}
        {:else}
            <p class="text-xl text-center font-bold p-10">No items in this list</p>
        {/if}
    </section>
</section>
