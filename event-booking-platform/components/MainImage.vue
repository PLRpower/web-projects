<script setup lang="ts">
defineProps({
  letter: String,
});
</script>

<template>
  <div class="relative group">
    <div class="w-full flex-none group-hover:opacity-40 transition-all ease-in-out duration-300">
      <slot></slot>
    </div>
    <span class="overlay group-hover:opacity-100 cursor-default font-variant">{{ letter }}</span>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3em;
  font-weight: bold;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
