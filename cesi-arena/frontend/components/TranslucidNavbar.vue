<script setup lang="ts">
const user = useStrapiUser()
</script>

<template>
    <div class="top-0 z-20 absolute w-full py-4" id="gsap-translucidNavbar">
        <div class="flex container mx-auto justify-between">
            <div>
                <NuxtImg src="/img/logo.png" alt="Logo" class="h-8"/>
            </div>
            <div class="flex gap-x-4">
                <TranslucidButton text="Accueil" link="/" />
                <TranslucidButton text="Évènements" link="/evenements" />
                <TranslucidButton text="Campus" link="/campus" />
                <TranslucidButton text="Jeux" link="/jeux" />
            </div>
            <div class="flex gap-x-4 justify-end" v-if="!user">
                <TranslucidButton text="Connexion" link="/connexion" />
                <TranslucidButton text="Inscription" link="/jeux" />
            </div>
        </div>
    </div>
</template>