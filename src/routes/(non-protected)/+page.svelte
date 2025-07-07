<script>
    import logoLong from '$lib/assets/images/logo-long.png';
</script>

<svelte:head>
	<title>Lizter</title>
</svelte:head>

<section class="max-w-[1200px]">
    <section class="flex flex-col-reverse justify-center items-center gap-8 p-3 md:flex-row md:p-8">
        <section class="flex-1 flex flex-col justify-center gap-4">
            <h1 class="text-6xl">Lizter - The Universal List App</h1>
            <h2 class="text-3xl">All Your Lists. <strong class="font-bold">One Place.</strong></h2>
            <p class="text-xl">
                Tired of juggling multiple apps to keep track of your favorite content? Lizter brings everything together. Create and manage lists for Movies, Series, Games, Books, Anime, and more — all in one easy-to-use app.
            </p>
            <section class="flex items-center gap-8 p-4">
                <a
                    class="bg-primary text-white text-xl px-6 py-3 rounded-full"
                    href="/login"
                >
                    Login
                </a>
                <a
                    class="bg-white outline-4 outline-primary text-primary text-xl px-6 py-3 rounded-full"
                    href="/signup"
                >
                    Sign Up
                </a>
            </section>
        </section>
        <section class="flex-1 max-w-[500px]">
            <img src={logoLong} alt="Lizter">
        </section>
    </section>
</section>
