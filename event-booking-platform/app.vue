<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <div>
    <SpeedInsights />
    <header>
      <Navbar />
    </header>

    <main>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>

    <footer>
      <Footer />
    </footer>

  </div>
</template>