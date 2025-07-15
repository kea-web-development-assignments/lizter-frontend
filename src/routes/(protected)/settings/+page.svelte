<script>
    import { page } from '$app/stores';
    import { goto, invalidateAll } from '$app/navigation';
    import { UserForm, InputField, SubmitButton } from '$lib/components';
    import { userValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let updateForm;
    let deleteForm;

    let updateError = {};
    let deleteError = {};

    async function update() {
        updateError = {};
        const user = Object.fromEntries(new FormData(updateForm));

        const response = await api.patch('/me', user);
        const { data } = response;

        if(data.error) {
            updateError = data.error;
            return;
        }

        alert('Your account info has been updated!');

        if(user.email !== $page.data?.user?.email) {
            goto('/logout');
            return;
        }

        await invalidateAll();
    }
    async function deleteAccount() {
        deleteError = {};
        const { password } = Object.fromEntries(new FormData(deleteForm));

        const response = await api.delete(`/me?password=${password}`);
        const { data } = response;

        if(data.error) {
            deleteError = data.error;
            return;
        }

        alert('Your account has been deleted, you will receive an email about it shortly.');
        goto('/logout');
    }
</script>

<svelte:head>
    <title>Settings | Lizter</title>
</svelte:head>

<section class="w-full flex flex-col justify-center items-center">
    <h2 class="max-w-[24rem] w-full text-4xl p-4 pl-0">Update account</h2>
    <UserForm
        bind:thisForm={updateForm}
        errorMessage={updateError?.message}
        onSubmit={update}
    >
        <InputField
            name="username"
            label="Username"
            value={$page.data?.user?.username}
            errorMessage={updateError?.fields?.username}
            {...userValidation.username}
        />
        <InputField
            name="firstName"
            label="First name"
            value={$page.data?.user?.firstName}
            errorMessage={updateError?.fields?.firstName}
            {...userValidation.firstName}
        />
        <InputField
            name="lastName"
            label="Last name"
            value={$page.data?.user?.lastName}
            errorMessage={updateError?.fields?.lastName}
            {...userValidation.lastName}
        />
        <InputField
            type="email"
            name="email"
            label="Email"
            value={$page.data?.user?.email}
            errorMessage={updateError?.fields?.email}
            {...userValidation.email}
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            errorMessage={updateError?.fields?.password}
            {...userValidation.password}
        />
        <InputField
            type="password"
            name="oldPassword"
            label="Old password"
        />
        <section slot="after-error-message">
            <SubmitButton text="Update" />
        </section>
    </UserForm>
    <h2 class="max-w-[24rem] w-full text-4xl mt-2 p-4 pl-0">Delete account</h2>
    <UserForm
        bind:thisForm={deleteForm}
        errorMessage={deleteError?.message}
        onSubmit={deleteAccount}
    >
        <InputField
            type="password"
            name="password"
            label="Password"
            errorMessage={deleteError?.fields?.password}
        />
        <section slot="after-error-message">
            <SubmitButton text="Delete" addToStyle="bg-rose-500" />
        </section>
    </UserForm>
</section>
