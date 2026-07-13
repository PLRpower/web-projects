<script>
export default {
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  }
}
</script>

<template>
  <div class="flex gap-x-4 mb-16">
    <div class="border-b-2 text-center basis-1/3" :class="{ 'border-black': 1 === currentStep }">
      <span class="font-bold">1</span>
      <p class="text-sm md:text-base" :class="{ 'font-bold': 1 === currentStep }">Panier</p>
    </div>
    <div class="border-b-2 text-center basis-1/3" :class="{ 'border-black': 2 === currentStep }">
      <span class="font-bold">2</span>
      <p class="text-sm md:text-base" :class="{ 'font-bold': 2 === currentStep }">Coordonnées</p>
    </div>
    <div class="border-b-2 text-center basis-1/3" :class="{ 'border-black': 4 === currentStep }">
      <span class="font-bold">3</span>
      <p class="text-sm md:text-base" :class="{ 'font-bold': 4 === currentStep }">Confirmation</p>
    </div>
  </div>
</template>

<style scoped>

</style>