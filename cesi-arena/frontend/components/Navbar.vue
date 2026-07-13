<script setup lang="ts">
const user = useStrapiUser()
</script>

<template>
    <div class="bg-midnight z-20 sticky top-0 w-full py-4" id="gsap-navbar">
        <div class="flex container mx-auto justify-between">
            <div >
                <NuxtImg src="/img/logo.png" alt="Logo" class="h-8"/>
            </div>
            <div class="flex gap-x-4">
                <Button text="Accueil" link="/" />
                <Button text="Évènements" link="/evenements" />
                <Button text="Campus" link="/campus" />
                <Button text="Jeux" link="jeux" />
            </div>
            <div class="flex gap-x-4 justify-end" v-if="!user">
                <Button text="Connexion" link="connexion" />
                <Button text="Inscription" link="inscription" />
            </div>
        </div>
    </div>
</template>