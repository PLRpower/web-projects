<script setup>
defineProps(['game', "size"])
</script>

<template>
    <NuxtLink
        :to="`/jeux/${game?.documentId}`"
        :class="[
            'relative shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-95 cursor-pointer',
            size === 'small' ? 'w-xs' : 'w-md'
        ]"
    >
        <NuxtImg
            provider="strapi"
            :src="game?.picture?.url"
            class="w-full h-full object-cover"
            alt="Image du jeu"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full p-4 text-white font-bold text-3xl bg-gradient-to-t from-black/60 to-transparent font-sans">
            <h2>{{ game?.name }}</h2>
        </div>
    </NuxtLink>
</template>

