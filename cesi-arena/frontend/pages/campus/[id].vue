<script setup lang="ts">
import { computed } from 'vue'
import type { Event, Campus } from '~/types/strapi'

const route = useRoute()
const { findOne, find } = useStrapi()

const { data: campusData } = await useAsyncData('campus', () =>
    findOne<Campus>('campuses', route.params.id, { populate: '*' })
)

const campus = campusData.value?.data

const { data: eventsData } = await useAsyncData('events', () =>
    find<Event>('events', {
        populate: '*',
        filters: {
            $or: [
                {
                    campuses: {
                        id: {
                            $eq: campus?.id
                        }
                    }
                },
                {
                    type: {
                        $eq: 'Online'
                    }
                }
            ]
        }
    })
)

const events = eventsData.value?.data ?? []

const sortedEvents = computed(() =>
    events.slice().sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
)
</script>


<template>
    <TranslucidNavbar />

    <div class="h-96 mb-32">
        <NuxtImg :src="campus?.picture?.url" provider="strapi" alt="BannerImage" class="absolute w-full h-96 object-cover z-0" />
        <div class="absolute w-full h-96 bg-gradient-to-b from-midnight/70 to-midnight z-10"></div>

        <div class="absolute top-72 left-32 z-20 max-w-4xl">
            <p class="uppercase">Campus</p>
            <h1 class="text-7xl font-bold my-2">
                {{ campus.name }}
            </h1>
            <p class="text-beige/60">{{ campus.description }}</p>
        </div>
    </div>

    <div class="container mx-auto">
        <div class="my-32">
            <h2 class="text-4xl mb-4">Tournois liés à {{ campus.name }}</h2>
            <div class="flex gap-x-8 text-beige overflow-x-auto overflow-y-hidden whitespace-nowrap">
                <EventCard
                    v-for="event in sortedEvents"
                    :key="event.id"
                    :EventImage="event?.picture?.url || ''"
                    :EventName="event?.name || 'Sans nom'"
                    :EventLink="`/evenements/${event.documentId}`"
                    :EventTagUn="event?.campuses?.[0]?.name || 'Campus inconnu'"
                    :EventTagUnLink="event?.campuses?.length > 0? `/campus/${event.campuses[0].documentId ?? event.campuses[0].id}`: null"
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