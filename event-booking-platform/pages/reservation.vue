<script setup lang="ts">
useSeoMeta({
  title: "F*cking World - Réservation",
  ogTitle: "F*cking World - Réservation",
  description: 'Réservez vos billets pour F*cking World dès maintenant !',
  ogDescription: 'Réservez vos billets pour F*cking World dès maintenant !',
  ogImage: '',
  twitterCard: 'summary_large_image',
})
</script>


<template>
  <div class="my-24 mx-2">
    <div class="text-center mb-16">
      <h1 class="font-variant text-4xl lg:text-6xl mb-4" data-aos="fade-up">Réservation</h1>
      <p class="font-neutral-700 text-lg" data-aos="fade-up" data-aos-delay="200">Obtenez vos billets dès maintenant !</p>
    </div>

    <div class="bg-white rounded-2xl lg:max-w-screen-lg mx-auto text-black p-8 lg:p-16" data-aos="fade-up" data-aos-delay="400">

      <ReservationInformations/>
        <h3 class="text-red-500">Réservations fermées.</h3>
    </div>
  </div>
</template>

<style scoped>
</style>