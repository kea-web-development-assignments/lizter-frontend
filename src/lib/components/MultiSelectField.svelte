<script>
    import { createEventDispatcher } from 'svelte';
    import MultiSelect from 'svelte-multiselect';

    export let containerClass = '';
    export let labelClass = 'text-black pl-1';
    export let multiSelectClass = 'w-full bg-gray-200 border border-gray-400 p-2 text-black';
    export let name = '';
    export let label = '';
    export let placeholder = '';
    export let selected = [];
    export let options = [];
    export let required = false;
    export let requiredMarker = false;
    export let errorMessage = '';

    let id = crypto.randomUUID();
    let outerDivElement = {};
    let showDropdown = false;

    const dispatch = createEventDispatcher();
</script>

<section class={containerClass}>
    <label
        class={labelClass}
        for={id}
    >
        {label}
        {#if required && requiredMarker}
            <span class="text-rose-500">*</span>
        {/if}
    </label>
    <MultiSelect
        --sms-bg="white"
        --sms-text-color="black"
        --sms-placeholder-color="gray"
        --sms-remove-btn-hover-bg="red"
        --sms-padding=".5rem"
        bind:outerDiv={outerDivElement}
        bind:open={showDropdown}
        outerDivClass={multiSelectClass}
        noMatchingOptionsMsg="No matching {label}"
        maxOptions={6}
        selectedOptionsDraggable={false}
        {id}
        {name}
        {placeholder}
        bind:selected={selected}
        {options}
        {required}
        onblur={() => {
            if(!outerDivElement.matches(':focus-within')) {
                showDropdown = false;
            }
        }}
        onchange={() => dispatch('change')}
    />
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
