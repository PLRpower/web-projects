<script setup lang="ts">

</script>

<template>

    <div class="rounded-lg shadow bg-neutral-950 m-4">
      <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <nuxt-link href="/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse bg-black p-4 rounded-2xl">
            <nuxt-img src="/img/logo.webp" loading="lazy" class="h-8" alt="F*cking world" width="32" height="32" />
          </nuxt-link>
          <ul class="flex flex-wrap items-center mb-6 font-medium sm:mb-0 text-neutral-400">
            <li>
              <nuxt-link to="/" class="hover:underline me-4 md:me-6">Accueil</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/concept" class="hover:underline me-4 md:me-6">Concept</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/dress-code" class="hover:underline me-4 md:me-6">Dress code</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/reservation" class="hover:underline me-4 md:me-6">Réservation</nuxt-link>
            </li>
          </ul>
        </div>
        <hr class="my-6 sm:mx-auto border-neutral-700 lg:my-8" />
        <span class="block text-sm sm:text-center text-neutral-400">© 2025 <nuxt-link to="/" class="hover:underline">F*cking World</nuxt-link>. Tous droits réservés. Site web crée par le <nuxt-link to="https://osalys.studio" class="hover:underline">Studio Osalys</nuxt-link>.</span>
      </div>
    </div>

</template>

<style scoped>

</style>