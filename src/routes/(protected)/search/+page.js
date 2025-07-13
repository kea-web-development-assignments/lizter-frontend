import { createRequester } from '$lib/utils/apiRequester';

export async function load() {
    const api = createRequester();

    const itemTypesResponse = await api.get('/item-types');
    const { data: itemTypesData } = itemTypesResponse;

    if(itemTypesData?.error?.message) {
        alert(`Failed to get item types: ${itemTypesData.error.message}`);
        return;
    }

    const tagsResponse = await api.get('/tags');
    const { data: tagsData } = tagsResponse;

    if(tagsData?.error?.message) {
        alert(`Failed to get tags: ${tagsData.error.message}`);
        return;
    }

    return {
        itemTypes: itemTypesData?.itemTypes || [],
        tags: tagsData?.tags || [],
    };
}
