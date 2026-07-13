<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<template>
  <div class="relative group mb-2">
    <div class="w-full flex-none opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all ease-in-out duration-300">
      <slot></slot>
    </div>
    <span class="overlay group-hover:opacity-0 opacity-100 cursor-default font-variant text-2xl lg:text-5xl text-center">{{ title }}</span>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: white;
  opacity: 1;
  transition: opacity 0.3s ease;
}
</style>