<script>
    export let disabled;
</script>

<button
    class="rounded mx-1 px-2 py-1 sm:px-4 sm:py-2"
    class:bg-primary={!disabled}
    class:text-white={!disabled}
    class:bg-gray-400={disabled}
    class:text-gray-500={disabled}
    disabled={disabled}
    on:click
>
    <slot />
</button>
