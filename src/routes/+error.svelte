<script>
	import { page } from '$app/stores';
</script>

<section class="min-h-screen w-full flex flex-col justify-center items-center gap-4 p-4">
    {#if $page.status === 500 && $page.error.message === "Internal Error"}
        <h1 class="text-4xl">Unknown Error</h1>
        <p class="text-xl">Something went wrong, try again later</p>
    {:else}
        <h1 class="text-4xl">{$page.status}</h1>
        <p class="text-xl">{$page.error.message}</p>
    {/if}
</section>
