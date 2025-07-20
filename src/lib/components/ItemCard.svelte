<script>
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { Form, ItemForm, Modal, InputField, TextAreaField, ImagePicker, SelectField, MultiSelectField, ItemImage } from '$lib/components';
    import { itemValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    export let _id;
    export let slug;
    export let name;
    export let releaseDate;
    export let description;
    export let cover = '';
    export let images;
    export let type;
    export let tags;
    export let showDeleteButton;
    export let showUpdateButton;
    export let showRemoveButton;

    let updateForm;

    let showUpdateModal = false;
    let showDeleteModal = false;

	let updateError = {};
	let deleteError = {};

    const dispatch = createEventDispatcher();

    async function updateItem() {
        updateError = {};
        const itemData = new FormData(updateForm);

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

        const response = await api.patch(`/items/${_id}`, itemData);
        const { data } = response;

		if(data.error) {
			updateError = data.error;
			return;
		}

        showUpdateModal = false;
        dispatch('change');
        await invalidateAll();
    }

    async function deleteItem() {
        deleteError = {};

        const response = await api.delete(`/items/${_id}`);
        const { data } = response;

		if(data.error) {
			deleteError = data.error;
			return;
		}

        showDeleteModal = false;
        dispatch('change');
        await invalidateAll();
    }

    async function removeItemFromList() {
        const response = await api.delete(`/me/lists/${$page.params.name}/items/${_id}`);
        const { data } = response;

        if(data.error?.message) {
            alert(`Failed to remove item from list: ${data.error?.message}`);
            return;
        }

        dispatch('change');
        await invalidateAll();
    }
</script>

<a
    href={`/items/${type}/${slug}`}
    class="w-[20rem] min-w-[0] flex flex-col bg-slate-200 text-black rounded-md duration-200 hover:transform hover:-translate-y-1"
    data-sveltekit-preload-data="tap"
>
    <ItemImage
        src={cover}
        alt={name}
    />
    <section class="flex-1 max-h-44 p-3 flex flex-col gap-2">
        <section class="flex-1">
            <h3 class="text-lg font-bold text-ellipsis overflow-hidden text-nowrap mb-1">{name}</h3>
            <p class="text-ellipsis overflow-hidden line-clamp-3">{description}</p>
        </section>
        {#if showRemoveButton || showDeleteButton || showUpdateButton}
            <section class="flex justify-end text-lg gap-2">
                {#if showRemoveButton}
                    <button
                        class="w-3/5 bg-rose-500 text-white text-center rounded-lg cursor-pointer p-1"
                        on:click|stopPropagation|preventDefault={removeItemFromList}
                    >
                        Remove from list
                    </button>
                {/if}
                {#if showDeleteButton}
                    <button
                        class="w-1/3 bg-rose-500 text-white text-center rounded-lg cursor-pointer p-1"
                        on:click|stopPropagation|preventDefault={() => showDeleteModal = true}
                    >
                        Delete
                    </button>
                {/if}
                {#if showUpdateButton}
                    <button
                        class="w-1/3 bg-primary text-white text-center rounded-lg cursor-pointer p-1"
                        on:click|stopPropagation|preventDefault={() => showUpdateModal = true}
                    >
                        Update
                    </button>
                {/if}
            </section>
        {/if}
    </section>
</a>

<Modal
    bind:showModal={showUpdateModal}
    on:close={() => showUpdateModal = false}
>
    <ItemForm
        bind:thisForm={updateForm}
        submitText="Update Item"
        errorMessage={updateError?.message}
        onSubmit={updateItem}
        on:close
        on:close={() => showUpdateModal = false}
    >
        <InputField
            name="name"
            label="Name"
            value={name}
            errorMessage={updateError?.fields?.name}
            {...itemValidation.name}
        />
        <SelectField
            name="type"
            label="Type"
            value={type}
            errorMessage={updateError?.fields?.type}
        >
            {#each $page.data.itemTypes as itemType}
                <option value={itemType.name}>{itemType.name}</option>
            {/each}
        </SelectField>
        <TextAreaField
            name="description"
            label="Description"
            value={description}
            errorMessage={updateError?.fields?.description}
            {...itemValidation.description}
        />
        <InputField
            type="date"
            name="releaseDate"
            label="Release date"
            value={releaseDate}
            errorMessage={updateError?.fields?.releaseDate}
            {...itemValidation.releaseDate}
        />
        <ImagePicker
            name="cover"
            label="Cover"
            imagePreviews={cover ? [cover] : []}
            errorMessage={updateError?.fields?.cover}
        />
        <ImagePicker
            name="images[]"
            label="Images"
            imagePreviews={images ?? []}
            errorMessage={updateError?.fields?.images}
            multiple
        />
        <MultiSelectField
            name="tags"
            label="Tags"
            options={$page.data.tags?.map(tag => tag.name)}
            selected={tags}
            errorMessage={updateError?.fields?.tags}
        />
    </ItemForm>
</Modal>

<Modal
    bind:showModal={showDeleteModal}
    on:close={() => showDeleteModal = false}
>
    <Form>
        <h2 class="text-2xl font-bold">Delete Item</h2>
        <p class="mt-2">Are you sure you want to delete "{name}"?</p>
        {#if deleteError?.message}
            <p class="text-rose-500 text-center">{deleteError.message}</p>
        {/if}
        <section class="flex gap-16 mt-3">
            <button
                class="w-full bg-primary text-white text-center text-lg rounded-lg cursor-pointer p-1"
                on:click={() => showDeleteModal = false}
            >
                Close
            </button>
            <button
                class="w-full bg-rose-500 text-white text-center text-lg rounded-lg cursor-pointer p-1"
                on:click={deleteItem}
            >
                Delete
            </button>
        </section>
    </Form>
</Modal>
