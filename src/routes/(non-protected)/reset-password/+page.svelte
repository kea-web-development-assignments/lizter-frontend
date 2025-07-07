<script>
    import { goto } from '$app/navigation';
    import { UserForm, InputField, SubmitButton } from '$lib/components';
    import { userValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let resetPasswordForm;
    let error = {};

    async function resetPassword() {
        error = {};
        const formData = Object.fromEntries(new FormData(resetPasswordForm));

        const response = await api.post('/reset-password', formData);
        const { data } = response;

        if(data.error) {
            error = data.error;
            return;
        }

        alert(`An email with a link to reset your password has been sent to ${formData.email}, check your spam folder if you can't find it in your inbox.`);
        goto('/login');
    }
</script>

<svelte:head>
    <title>Reset password | Lizter</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={resetPasswordForm}
        errorMessage={error?.message}
        onSubmit={resetPassword}
    >
        <InputField
            type="email"
            name="email"
            label="Email"
            errorMessage={error?.fields?.email}
            required
            {...userValidation.email}
        />
        <section slot="after-error-message">
            <SubmitButton text="Reset password" />
        </section>
    </UserForm>
</section>
