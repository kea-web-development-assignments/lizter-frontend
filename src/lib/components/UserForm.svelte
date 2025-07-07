<script>
    import { Form } from '$lib/components';
    export let thisForm;
    export let errorMessage = '';
    export let onSubmit = () => {};
</script>

<Form
    bind:thisForm={thisForm}
    onSubmit={onSubmit}
>
    <slot />
    {#if errorMessage}
        <p class="text-rose-500 text-center">{errorMessage}</p>
    {/if}
    <slot name="after-error-message" />
</Form>
