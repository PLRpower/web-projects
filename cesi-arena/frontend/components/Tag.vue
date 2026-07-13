<script setup>
defineProps(['TagName', "TagUrl", "TagFontcolor", "TagBackgroundColor"])
</script>

<template>
    <NuxtLink v-if="TagName"
            :to="TagUrl"
              class="basis-[45%] grow-0 shrink-0 max-w-[300px] px-3 py-1 rounded-full text-xs shadow font-bold hover:scale-95 cursor-pointer flex items-center justify-center"
            :style="{color: TagFontcolor, backgroundColor: TagBackgroundColor}"
    >
        {{ TagName }}
    </NuxtLink>
</template>