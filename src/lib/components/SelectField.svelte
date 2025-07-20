<script>
    export let name = '';
    export let label = '';
    export let required = false;
    export let requiredMarker = false;
    export let value = '';
    export let errorMessage = '';

    let id = crypto.randomUUID();
</script>

<section>
    <label
        class='text-black pl-1'
        for={id}
    >
        {label}
        {#if required && requiredMarker}
            <span class="text-rose-500">*</span>
        {/if}
    </label>
    <select
        class='w-full bg-gray-200 border border-gray-400 rounded-sm p-2 text-black'
        {id}
        {name}
        {required}
        bind:value={value}
        on:change
    >
        <slot />
    </select>
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
