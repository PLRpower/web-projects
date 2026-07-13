<script setup lang="ts">
import { computed } from 'vue'
import type { Event, Game, Campus } from '~/types/strapi'


const route = useRoute()
const { findOne, find } = useStrapi()


const { data: eventData } = await useAsyncData('event', () =>
    findOne<Event>('events', route.params.id, { populate: '*' })
)

const { data: gamesData } = await useAsyncData('games', () =>
    find<Game>('games', { populate: '*' })
)

const { data: campusesData } = await useAsyncData('campuses', () =>
    find<Campus>('campuses', { populate: '*' })
)

// Puis tu utilises les données de façon similaire
const event = eventData.value?.data
const allGames = gamesData.value?.data ?? []
const allCampuses = campusesData.value?.data ?? []

const eventGameIds = new Set(event?.games.map((g: any) => g.id) ?? [])
const filteredGames = computed(() => allGames.filter(game => eventGameIds.has(game.id)))

const eventCampusIds = new Set(event?.campuses.map((c: any) => c.id) ?? [])
const filteredCampuses = computed(() => allCampuses.filter(campus => eventCampusIds.has(campus.id)))


const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>

<template>
    <TranslucidNavbar />

    <!-- Bannière -->
    <div class="relative h-96 mb-24">
        <NuxtImg
            :src="event?.picture?.url"
            provider="strapi"
            alt="EventBanner"
            class="absolute w-full h-96 object-cover z-0"
        />
        <div class="absolute w-full h-96 bg-gradient-to-b from-midnight/70 to-midnight z-10"></div>

        <div class="absolute bottom-10 left-32 z-20 max-w-4xl">
            <p class="uppercase text-beige/60">Événement</p>
            <h1 class="text-6xl font-bold text-beige mb-4">
                {{ event?.name || 'Nom inconnu' }}
            </h1>
        </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 relative">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

            <!-- Colonne gauche : texte (2 colonnes sur desktop) -->
            <div class="lg:col-span-2 space-y-8">
                <div class="bg-midnight-light/70 border border-beige/10 p-8 rounded-2xl shadow-md text-beige/90 space-y-6">
                    <!-- Description -->
                    <div>
                        <h2 class="text-3xl font-bold mb-2">Description</h2>
                        <p class="leading-relaxed">
                            {{ event?.description || 'Pas de description disponible.' }}
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3 text-sm font-semibold">
            <span
                class="bg-yellow-400 text-midnight px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors transform hover:scale-105 cursor-pointer"
            >
              📅 Début : {{ formatDate(event?.start_date) }}
            </span>

                        <span
                            v-if="event?.end_date"
                            class="bg-red-400 text-midnight px-4 py-2 rounded-full hover:bg-red-500 transition-colors ml-2 transform hover:scale-105 cursor-pointer"
                        >
              🛑 Fin : {{ formatDate(event.end_date) }}
            </span>

                        <span
                            class="bg-indigo-500/80 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors ml-2 transform hover:scale-105 cursor-pointer"
                        >
              🎮 Type : {{ event?.type || 'Non précisé' }}
            </span>

                        <span
                            :class="[
                event?.open_inscriptions
                  ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                  : 'bg-red-500 opacity-50 cursor-not-allowed',
                'text-white px-4 py-2 rounded-full transition-colors ml-2 select-none transform hover:scale-105',
              ]"
                        >
              {{ event?.open_inscriptions ? '🟢 Inscriptions ouvertes' : '🔒 Inscriptions fermées' }}
            </span>
                    </div>

                    <div v-if="event?.campuses?.length">
                        <h3 class="text-xl font-bold mb-1">Campus associés</h3>
                        <NuxtLink
                            v-for="campus in event.campuses"
                            :key="campus.id"
                            :to="`/campus/${campus.documentId ?? campus.id}`"
                            class="px-3 py-1 bg-beige/10 text-beige/80 rounded-full mr-2 inline-block transform hover:scale-105 cursor-pointer transition"
                        >
                            🎓 {{ campus.name }}
                        </NuxtLink>
                    </div>

                    <h2 class="text-3xl font-bold mb-4">Jeux concernés</h2>
                    <div class="flex gap-x-6 flex-wrap">
                        <GameCard
                            v-for="game in filteredGames"
                            :key="game.id"
                            :game="game"
                            size="small"
                        />
                    </div>
                </div>
            </div>

            <div class="sticky top-28">
                <div class="p-6 bg-midnight-light rounded-2xl shadow-lg border border-beige/10">
                    <h3 class="text-2xl font-bold mb-4 text-beige">Prêt à participer ?</h3>
                    <p class="text-beige/70 mb-6">Clique ici pour t’inscrire à l’événement !</p>
                    <NuxtLink
                        to="/"
                        class="w-full block bg-saumon hover:bg-saumon/90 transition-transform text-midnight font-bold py-3 px-6 rounded-xl transform hover:scale-95 cursor-pointer text-center"
                        :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': !event?.open_inscriptions }"
                    >
                        {{ event?.open_inscriptions ? 'S’inscrire' : 'Inscriptions fermées' }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<style scoped>
/* Ajoute ici tes styles si besoin */
</style>
