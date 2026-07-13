<script setup>
useSeoMeta({
  title: "F*cking World - Confirmation de commande",
  ogTitle: "F*cking World - Confirmation de commande",
  description: 'Votre réservation a bien été prise en compte !',
  ogDescription: 'Votre réservation a bien été prise en compte !',
  ogImage: '',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="my-24 mx-2">
    <div class="text-center mb-16">
      <h1 class="font-variant text-4xl lg:text-6xl mb-4">Réservation</h1>
      <p class="font-neutral-700 text-lg">Obtenez vos billets dès maintenant !</p>
    </div>

    <div class="bg-white rounded-2xl lg:max-w-screen-lg mx-auto text-black p-8 lg:p-16">

      <ReservationInformations/>

      <ReservationStep :currentStep="4" />

      <div id="success" class="max-w-screen-sm mx-auto">
        <p class="text-center font-variant text-3xl mb-2">Réservation réussie !</p>
        <p class="text-center text-lg">
          Rendez vous le 20 juin 2025 à 20h00 !<br>
          Un email de confirmation va vous être envoyé d'ici quelques minutes (vérifiez vos spams !)
        </p>
        <nuxt-img loading="lazy" src="/img/success.svg" alt="Succès" class="mx-auto"/>
        <WhiteButton link="/" class="mx-auto" icon="mingcute:home-3-fill">Retour à l'accueil</WhiteButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>