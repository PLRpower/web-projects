<template>
    <footer>
        <div class="mx-auto w-full py-6 lg:py-8">
            <div class="md:flex md:justify-between max-w-screen-xl mx-auto">
                <div class="mb-6 md:mb-0">
                    <NuxtLink to="https://cesi-arena.vercel.app" class="flex items-center">
                        <NuxtImg src="/img/logo.png" class="h-8 me-3" alt="CESI Arena Logo" />
                    </NuxtLink>
                    <p>CESI Arena</p>
                </div>
                <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                    <div>
                        <h2 class="mb-6 text-sm font-semibold uppercase">Pages</h2>
                        <ul class="text-beige/70 font-medium">
                            <li class="mb-4">
                                <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
                            </li>
                            <li class="mb-4">
                                <NuxtLink to="/evenements" class="hover:underline">Évènements</NuxtLink>
                            </li>
                            <li class="mb-4">
                                <NuxtLink to="/campus" class="hover:underline">Campus</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/jeux" class="hover:underline">Jeux</NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="mb-6 text-sm font-semibold uppercase">Suivez-nous</h2>
                        <ul class="text-beige/70 font-medium">
                            <li class="mb-4">
                                <NuxtLink to="https://discord.gg/" class="hover:underline">Discord</NuxtLink>
                            </li>
                            <li class="mb-4">
                                <NuxtLink to="https://twitch.com/" class="hover:underline ">Twitch</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="https://instagram.com/" class="hover:underline ">Instagram</NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="mb-6 text-sm font-semibold uppercase">Légal</h2>
                        <ul class="text-beige/70 font-medium">
                            <li class="mb-4">
                                <NuxtLink to="#" class="hover:underline">Cookies</NuxtLink>
                            </li>
                            <li class="mb-4">
                                <NuxtLink to="#" class="hover:underline">Termes & Conditions</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="#" class="hover:underline">CGU</NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr class="my-6 sm:mx-auto border-beige/50 lg:my-8" />
            <div class="sm:flex sm:items-center sm:justify-between max-w-screen-xl mx-auto">
                <span class="text-sm sm:text-center">© 2025 <NuxtLink to="https://cesi-arena.vercel.app" class="hover:underline">CESI Arena™</NuxtLink>. Tous droits reservés.</span>
                <div class="flex mt-4 sm:justify-center sm:mt-0">
                    <NuxtLink to="https://discord.com" class="text-beige/50 hover:text-white">
                        <Icon name="simple-icons:discord" />
                        <span class="sr-only">Discord</span>
                    </NuxtLink>
                    <NuxtLink to="https://twitch.com" class="text-beige/50 hover:text-white ms-5">
                        <Icon name="simple-icons:twitch" />
                        <span class="sr-only">Twitch</span>
                    </NuxtLink>
                    <NuxtLink to="https://instagram.com" class="text-beige/50 hover:text-white ms-5">
                        <Icon name="simple-icons:instagram" />
                        <span class="sr-only">Instagram</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
</script>