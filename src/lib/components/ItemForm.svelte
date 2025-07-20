<script>
    import { createEventDispatcher } from 'svelte';
    import { Form, SubmitButton } from '$lib/components';

    export let thisForm;
    export let submitText = 'Submit';
    export let errorMessage = '';
    export let onSubmit = () => {};

    const dispatch = createEventDispatcher();
</script>

<Form
    bind:thisForm={thisForm}
    onSubmit={onSubmit}
>
    <slot />
    {#if errorMessage}
        <p class="text-rose-500 text-center">{errorMessage}</p>
    {/if}
    <section class="flex gap-16 mt-2">
        <button
            type="button"
            class="w-full bg-rose-500 text-white text-center text-lg rounded-lg cursor-pointer p-1"
            on:click={() => dispatch('close')}
        >Close</button>
        <SubmitButton text={submitText} />
    </section>
</Form>
