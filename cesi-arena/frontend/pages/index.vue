<script setup lang="ts">
import EventCard from "../components/EventCard.vue";
import GameCard from "../components/GameCard.vue";
import HeroSection from "../components/HeroSection.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import type { Event, Game } from '~/types/strapi'

const { find } = useStrapi()

const {data: eventsData} = await useAsyncData('events', () =>
    find<Event>('events', { populate: '*' })
)

const {data: gamesData} = await useAsyncData('games', () =>
    find<Game>('games', { populate: '*' })
)

const sortedEvents = computed(() => {
    return eventsData.value?.data
        ?.slice()
        ?.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) ?? []
})
</script>

<template>
    <Navbar style="opacity: 0; position: fixed" />

    <HeroSection />

    <section class="bg-midnight">
        <div class="container py-16 mx-auto">
            <h2 class="text-5xl font-bold">Les prochains tournois</h2>
            <div class="flex mt-8 gap-x-8 text-beige overflow-x-auto overflow-y-hidden whitespace-nowrap">
                <!-- Les tournois -->
                <EventCard
                    v-for="event in sortedEvents"
                    :key="event.id"
                    :EventImage="event?.picture?.url || ''"
                    :EventName="event?.name || 'Sans nom'"
                    :EventLink="`/evenements/${event.documentId}`"
                    :EventTagUn="event?.campuses?.[0]?.name || 'Campus inconnu'"
                    :EventTagUnLink="event.campuses?.length > 0? `/campus/${event.campuses[0].documentId ?? event.campuses[0].id}`: null"
                    :EventTagDeux="event?.games?.[0]?.name || 'Jeu inconnu'"
                    :EventTagDeuxLink="event?.games?.[0] ? `/jeux/${event.games[0].documentId ?? event.games[0].id}` : null"
                    :EventTagTrois="event?.type || 'Type inconnu'"
                    :EventStatus="event?.open_inscriptions ?? false"
                />

            </div>
        </div>

        <div class="container py-16 mx-auto">
            <h2 class="text-5xl font-bold">Les Jeux</h2>
            <div class="flex mt-8 gap-x-8">
                <!-- Les jeux -->
                <GameCard
                    v-for="game in gamesData?.data"
                    :key="game.id"
                    :game="game"
                    size="small"
                />
            </div>
        </div>
    </section>

    <Footer />
</template>
