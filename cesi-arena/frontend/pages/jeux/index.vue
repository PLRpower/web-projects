<script setup lang="ts">
import TranslucidNavbar from "../components/TranslucidNavbar.vue";
import GameCard from "../components/GameCard.vue";
import Footer from "../components/Footer.vue";
import type { Game } from '~/types/strapi'

const { find } = useStrapi()

const {data: games} = await useAsyncData('games', () =>
    find<Game>('games', { populate: '*' })
)
</script>

<template>
    <TranslucidNavbar />

    <div class="h-96">
        <NuxtImg src="/img/Nanyuki.jpg" alt="BannerImage" class="absolute w-full h-96 object-cover z-0" />
        <div class="absolute w-full h-96 bg-gradient-to-b from-midnight/70 to-midnight z-10"></div>

        <div class="absolute top-72 left-32 z-20 max-w-4xl">
            <h1 class="text-7xl font-bold my-2">
                Les Jeux
            </h1>
            <p class="text-beige/60">
                Que les jeux commencent ! Voici les arènes où les plus vaillants s'affronteront pour la gloire lors des tournois de L'Arena.
            </p>
        </div>
    </div>

    <div class="container py-16 mx-auto">
        <div class="flex flex-wrap justify-center gap-10 mt-8 mx-auto">
            <!-- Les jeux -->
            <GameCard
                v-for="game in games.data"
                :key="game.id"
                :game="game"
                size="medium"
            />
        </div>
    </div>
    <Footer />
</template>