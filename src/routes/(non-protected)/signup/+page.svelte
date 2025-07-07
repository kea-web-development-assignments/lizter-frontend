<script>
    import { goto } from '$app/navigation';
    import { UserForm, InputField, SubmitButton } from '$lib/components';
    import { userValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let signupForm;
    let error = {};

    async function signup() {
        error = {};
        const user = Object.fromEntries(new FormData(signupForm));

        const response = await api.post('/signup', user);
        const { data } = response;

        if(data.error) {
            error = data.error;
            return;
        }

        alert(`An email with a verification link has been sent to ${user.email}, check your spam folder if you can't find it in your inbox.`);
        goto('/login');
    }
</script>

<svelte:head>
    <title>Sign up | Lizter</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={signupForm}
        errorMessage={error?.message}
        onSubmit={signup}
    >
        <InputField
            name="username"
            label="Username"
            errorMessage={error?.fields?.username}
            required
            requiredMarker
            {...userValidation.username}
        />
        <InputField
            name="firstName"
            label="First name"
            errorMessage={error?.fields?.firstName}
            required
            requiredMarker
            {...userValidation.firstName}
        />
        <InputField
            name="lastName"
            label="Last name"
            errorMessage={error?.fields?.lastName}
            required
            requiredMarker
            {...userValidation.lastName}
        />
        <InputField
            type="email"
            name="email"
            label="Email"
            errorMessage={error?.fields?.email}
            required
            requiredMarker
            {...userValidation.email}
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            errorMessage={error?.fields?.password}
            required
            requiredMarker
            {...userValidation.password}
        />
        <section slot="after-error-message">
            <SubmitButton text="Sign up" />
            <p class="text-center text-sm text-black">
                Already have an account? <a class="text-blue-800 hover:underline" href="/login">Log in</a>
            </p>
        </section>
    </UserForm>
</section>
