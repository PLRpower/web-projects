<template>
    <NuxtLink :to="link" class="rounded-lg px-8 py-1 cursor-pointer bg-beige/40 backdrop-blur-md shadow-lg border-2 border-beige/60 hover:scale-105 transition ease-in-out text-black">
        {{ text }}
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps(['text', 'link'])
</script>