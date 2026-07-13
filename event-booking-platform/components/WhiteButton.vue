<script>
export default {
  props: {
    icon: String,
    link: String
  },
};
</script>

<template>
  <a class="rounded-full p-3 border-2 font-variant flex w-fit items-center hover:scale-105 ease-in-out transition-all" :href="link">
    <Icon :name="icon" class="text-xl me-2" />
    <slot></slot>
  </a>
</template>

<style scoped>

</style>