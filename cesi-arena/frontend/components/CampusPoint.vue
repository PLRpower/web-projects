<template>
    <div class="absolute group" :style="{ top, left }">
        <div class="relative w-4 h-4">
            <NuxtLink
                :to="`/campus/${link}`"
                class="absolute inset-0 z-10 rounded-full"
            />
            <div class="w-full h-full bg-saumon rounded-full hover:scale-125 transition-transform"></div>
        </div>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-neutral-900 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            <NuxtImg :src="campus?.picture?.url" :alt="campus?.name" provider="strapi" class="w-full h-24 object-cover rounded-md mb-2" loading="lazy"/>
            <p class="text-sm text-center font-medium text-white">
                {{ campus?.name }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Campus } from '~/types/strapi'

const props = defineProps({
    top: String,
    left: String,
    link: {
        type: String,
        required: true
    }
})
const { findOne } = useStrapi()
const response = await findOne<Campus>('campuses', props.link, { populate: '*' })
const campus = response.data
</script>
