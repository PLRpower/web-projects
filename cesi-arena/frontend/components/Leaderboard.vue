<template>
    <div class="overflow-x-auto rounded-xl shadow-lg border border-beige/20">
        <table class="min-w-full table-auto">
            <thead class="bg-midnight/90 text-left text-sm uppercase tracking-wider border-b border-beige/20">
            <tr>
                <th class="px-6 py-4">#</th>
                <th class="px-6 py-4">Équipe</th>
                <th class="px-6 py-4">Acronyme</th>
                <th class="px-6 py-4">Score</th>
                <th class="px-6 py-4">V/D</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(team, index) in teams"
                :key="team.id || index"
                class="hover:bg-midnight/70 transition-colors border-b border-beige/10"
            >
                <td class="px-6 py-4 font-semibold text-lg">{{ index + 1 }}</td>
                <td class="px-6 py-4 flex items-center gap-3">
                    <NuxtImg :src="team.logo" alt="Logo" class="w-10 h-10 rounded-full object-cover" />
                    <span class="font-medium text-lg">{{ team.name }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-beige/80">{{ team.acronym }}</td>
                <td class="px-6 py-4 font-bold text-xl">{{ team.score }}</td>
                <td class="px-6 py-4 text-sm">{{ team.wins }} / {{ team.losses }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    teams: {
        id?: string | number
        name: string
        logo: string
        acronym: string
        score: number
        wins: number
        losses: number
    }[]
}>()
</script>
