<script>
    import { jwtDecode } from 'jwt-decode';
    import { goto } from '$app/navigation';
    import { UserForm, InputField, SubmitButton } from '$lib/components';
    import { userValidation } from '$lib/utils/validator.js';
    import { createRequester } from '$lib/utils/apiRequester';

    const api = createRequester();

    let loginForm;
    let error = {};

    async function login() {
        error = {};
        const credentials = Object.fromEntries(new FormData(loginForm));

        const response = await api.post('/login', credentials);
        const { data } = response;

        if(data.error) {
            error = data.error;
            return;
        }

        const { sub: id, email, username, firstName, lastName, role } = jwtDecode(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', id);
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('role', role);

        goto('/search');
    }
</script>

<svelte:head>
    <title>Login | Lizter</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={loginForm}
        errorMessage={error?.message}
        onSubmit={login}
    >
        <InputField
            type="email"
            name="email"
            label="Email"
            errorMessage={error?.fields?.email}
            required
            {...userValidation.email}
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            errorMessage={error?.fields?.password}
            required
        />
        <p class="text-end text-sm -mt-2">
            <a
                class="text-blue-800 hover:underline"
                href="/reset-password"
            >
                Forgot password?
            </a>
        </p>
        <section slot="after-error-message">
            <SubmitButton text="Login" />
            <p class="text-center text-sm text-black">
                Don't have an account? <a class="text-blue-800 hover:underline" href="/signup">Sign up</a>
            </p>
        </section>
    </UserForm>
</section>
