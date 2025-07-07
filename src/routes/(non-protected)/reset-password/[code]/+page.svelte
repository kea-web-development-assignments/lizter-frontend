<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { UserForm, InputField, SubmitButton } from '$lib/components';
    import { userValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let updatePasswordForm;
    let error = {};

    async function updatePassword() {
        error = {};
        const formData = Object.fromEntries(new FormData(updatePasswordForm));

        const response = await api.post(`/reset-password/${$page.params.code}`, formData);
        const { data } = response;

        if(data.error) {
            error = data.error;
            return;
        }

        alert('Your password has been reset!');
        goto('/login');
    }
</script>

<svelte:head>
    <title>Update reset password | Lizter</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={updatePasswordForm}
        errorMessage={error?.message}
        onSubmit={updatePassword}
    >
        <InputField
            type="password"
            name="password"
            label="Password"
            errorMessage={error?.fields?.password}
            required
            {...userValidation.password}
        />
        <section slot="after-error-message">
            <SubmitButton text="Update password" />
        </section>
    </UserForm>
</section>
