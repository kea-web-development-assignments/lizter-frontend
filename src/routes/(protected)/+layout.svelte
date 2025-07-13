<script>
    import { page } from '$app/stores';
    import logo from '$lib/assets/images/logo.png';
    import BurgerMenu from '$lib/assets/icons/BurgerMenu.svelte';
    import CogIcon from '$lib/assets/icons/CogIcon.svelte';
    import DBIcon from '../../lib/assets/icons/DBIcon.svelte';
    import ExitIcon from '$lib/assets/icons/ExitIcon.svelte';
    import SearchIcon from '$lib/assets/icons/SearchIcon.svelte';
    import XIcon from '$lib/assets/icons/XIcon.svelte';

    let hideSidebar = true;

    $: $page.url.pathname, hideSidebar = true;
</script>

<nav class="flex fixed items-center h-14 w-full z-10 bg-slate-900 p-4 pl-8 lg:hidden">
    <button on:click={() => hideSidebar = false}>
        <BurgerMenu />
    </button>
</nav>
<section class="flex">
    <aside
        class="fixed min-h-screen h-full w-72 top-0 left-0 overflow-auto z-30 bg-slate-900 lg:block"
        class:hidden={hideSidebar}
    >
        <section class="flex justify-center p-4 pb-2">
            <a href="/search" class="w-28 md:w-40">
                <img src={logo} alt="Lizter">
            </a>
            <button
                class="h-min ml-auto lg:hidden"
                on:click={() => hideSidebar = true}
            >
                <XIcon />
            </button>
        </section>
        <ul class="p-4 pt-0">
            <li class="my-2">
                <a
                    href="/search" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={$page.url.pathname.endsWith('/search')}
                >
                    <SearchIcon />
                    <span class="ml-3">Search</span>
                </a>
            </li>
            {#if localStorage.getItem('role') == 'admin'}
                <li class="my-2">
                    <a
                        href="/admin/items" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                        class:bg-gray-700={$page.url.pathname.endsWith('/admin/items')}
                    >
                        <DBIcon />
                        <span class="ml-3">Administer Items</span>
                    </a>
                </li>
            {/if}
            <li class="my-2">
                <a
                    href="/settings" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={$page.url.pathname.endsWith('/settings')}
                >
                    <CogIcon />
                    <span class="ml-3">Settings</span>
                </a>
            </li>
            <li class="my-2">
                <a href="/logout" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700" data-sveltekit-preload-data="tap">
                    <ExitIcon color="#F43F5E" />
                    <span class="ml-3 text-rose-500">Log Out</span>
                </a>
            </li>
            {#if $page.data?.lists}
                <div class="h-[1px] w-[90%] bg-gray-600 mx-auto my-6"></div>
                <li>
                    <span class="ml-5 text-gray-500 text-sm font-bold">My Lists</span>
                </li>
                {#each $page.data.lists as list}
                    <li class="my-2">
                        <a
                            href="/lists/{list.name}" class="flex items-center rounded-lg p-2 hover:bg-gray-700"
                            class:bg-gray-700={$page.url.pathname.endsWith(`/lists/${list.name}`)}
                        >
                            <span class="ml-3">{list.name}</span>
                        </a>
                    </li>
                {/each}
            {/if}
        </ul>
    </aside>
    <button
        class="fixed w-screen h-screen z-20 bg-black opacity-30 overscroll-contain lg:hidden"
        class:hidden={hideSidebar}
        on:click={() => hideSidebar = true}
        aria-label="Hide sibebar"
    ></button>
    <section class="min-h-[calc(100vh-3.5rem)] w-full content-center justify-items-center mt-14 lg:min-h-screen lg:mt-0 lg:pl-72">
        <section class="h-full max-w-[1400px] w-full content-center justify-items-center p-4">
            <slot />
        </section>
    </section>
</section>
