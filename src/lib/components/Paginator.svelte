<script>
    import { createEventDispatcher } from 'svelte';
    import { PaginatorButton } from '$lib/components';

    export let start;
    export let limit;
    export let totalItems;
    export let currentPage;

    const dispatch = createEventDispatcher();

    $: totalPages = Math.ceil(totalItems / limit);

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            start = (currentPage - 1) * limit;
            dispatch('change');
        }
    }
</script>

<section class="w-full flex justify-center items-center py-4">
    <PaginatorButton 
        on:click={() => goToPage(1)} 
        disabled={currentPage <= 1}
    >
        &laquo;
    </PaginatorButton>
    <PaginatorButton 
        on:click={() => goToPage(currentPage - 1)} 
        disabled={currentPage <= 1}
    >
        &larr;
    </PaginatorButton>
    <PaginatorButton 
        on:click={() => goToPage(currentPage + 1)} 
        disabled={currentPage >= totalPages}
    >
        &rarr;
    </PaginatorButton>
    <PaginatorButton 
        on:click={() => goToPage(totalPages)} 
        disabled={currentPage >= totalPages}
    >
        &raquo;
    </PaginatorButton>
</section>
