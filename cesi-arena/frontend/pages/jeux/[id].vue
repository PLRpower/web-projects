<script setup lang="ts">
const route = useRoute()
const { findOne, find } = useStrapi()
import type { Event, Game } from '~/types/strapi'

const { data: gameData } = await useAsyncData('game', () =>
    findOne<Game>('games', route.params.id, { populate: '*' })
)

const game = gameData.value?.data

const { data: eventsData } = await useAsyncData('events', () =>
    find<Event>('events', {
        populate: '*',
        filters: {
            games: {
                id: {
                    $eq: game?.id
                }
            }
        }
    })
)

const events = eventsData.value?.data ?? []

const sortedEvents = computed(() =>
    events.slice().sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
)

// Ton tableau statique sampleTeams reste inchangé
const sampleTeams = [
    {
        id: 1,
        name: 'Quoicounoobzzzzz',
        logo: '/img/olivios.png',
        acronym: 'QCN',
        score: 48,
        wins: 16,
        losses: 0,
    },
    {
        id: 2,
        name: 'Karmine Corp',
        logo: '/img/Nanyuki.jpg',
        acronym: 'KC',
        score: 36,
        wins: 12,
        losses: 4,
    },
    {
        id: 4,
        name: 'Telecom 1',
        logo: '/img/GPinfo.webp',
        acronym: 'T1',
        score: 33,
        wins: 11,
        losses: 5,
    },
    {
        id: 3,
        name: 'KOI',
        logo: '/img/sad.webp',
        acronym: 'KOI',
        score: 24,
        wins: 8,
        losses: 8,
    },
]
</script>


<template>
    <TranslucidNavbar />

    <div class="h-96 mb-32">
        <NuxtImg :src="game?.banner?.url" provider="strapi" alt="BannerImage" class="absolute w-full h-96 object-cover z-0" />
        <div class="absolute w-full h-96 bg-gradient-to-b from-midnight/70 to-midnight z-10"></div>

        <div class="absolute top-72 left-32 z-20 max-w-4xl">
            <p class="uppercase">Jeux</p>
            <h1 class="text-7xl font-bold my-2">
                {{ game.name }}
            </h1>
            <p class="text-beige/60">{{ game.description }}</p>
        </div>
    </div>

    <div class="container mx-auto">
        <div>
            <h2 class="text-4xl mb-4">Classements</h2>
            <Leaderboard :teams="sampleTeams" />
        </div>
        <div class="mt-32" v-if="sortedEvents.length > 0">
            <h2 class="text-4xl mb-4">Tournois liés à {{ game.name }}</h2>
            <div class="flex gap-x-8 text-beige overflow-x-auto overflow-y-hidden whitespace-nowrap">
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

    </div>

    <Footer />
</template>