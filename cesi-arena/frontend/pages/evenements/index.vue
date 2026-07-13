<script setup lang="ts">
const { find } = useStrapi()
import type { Event } from '~/types/strapi'

const { data: eventsData } = await useAsyncData('events', () =>
    find<Event>('events', { populate: '*' })
)

const events = eventsData.value?.data ?? []

const sortedEvents = computed(() =>
    events.slice().sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
)
</script>


<template>
    <TranslucidNavbar />

    <div class="h-96 relative">
        <NuxtImg src="/img/Nanyuki.jpg" alt="BannerImage" class="absolute w-full h-96 object-cover z-0" />
        <div class="absolute w-full h-96 bg-gradient-to-b from-midnight/70 to-midnight z-10"></div>

        <div class="absolute top-72 left-32 z-20 max-w-4xl">
            <h1 class="text-7xl font-bold my-2">Les Events</h1>
            <p class="text-beige/60">
                Découvrez toutes les arènes de Arena, qu’elles vibrent encore de combats en cours ou qu’elles aient
                refermé leurs portes après l’affrontement. Proches ou lointaines, elles n’attendent que vous.
            </p>
        </div>
    </div>

    <div v-if="sortedEvents.length > 0" class="container py-16 mx-auto mt-16">
        <h2 class="text-5xl font-bold">Les Tournois près de chez vous</h2>
        <div class="flex mt-8 gap-x-8 text-beige overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <!-- Exemples fixes -->
            <EventCard
                EventImage="/img/sad.webp"
                EventName="La polizia"
                EventTagUn="CESI STRASBOURG"
            />

            <EventCard
                EventImage="/img/Valorant.jpg"
                EventName="Sylvain"
                EventTagUn="CESI STRASBOURG"
            />
        </div>
    </div>

    <div class="container py-16 mx-auto">
        <h2 class="text-5xl font-bold">Tous les Tournois</h2>

        <div  class="flex mt-8 gap-x-8 text-beige overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <EventCard
                v-for="event in sortedEvents"
                :key="event.id"
                :EventImage="event?.picture?.url || ''"
                :EventName="event?.name || 'Sans nom'"
                :EventLink="`/evenements/${event.documentId}`"
                :EventTagUn="event?.campuses?.[0]?.name || 'Campus inconnu'"
                :EventTagUnLink="event?.campuses?.length > 0 ? `/campus/${event.campuses[0].documentId ?? event.campuses[0].id}` : null"
                :EventTagDeux="event?.games?.[0]?.name || 'Jeu inconnu'"
                :EventTagDeuxLink="event?.games?.[0] ? `/jeux/${event.games[0].documentId ?? event.games[0].id}` : null"
                :EventTagTrois="event?.type || 'Type inconnu'"
                :EventStatus="event?.open_inscriptions ?? false"
            />
        </div>
    </div>

    <Footer />
</template>

<style scoped>
</style>
