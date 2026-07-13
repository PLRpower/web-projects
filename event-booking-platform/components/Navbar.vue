<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = (event: MouseEvent) => {
  const menu = document.getElementById('navbar-default');
  const button = document.querySelector('button[aria-controls="navbar-default"]');
  if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <nav class="border-neutral-200">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <nuxt-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <nuxt-img src="/img/logo.webp" class="h-8" alt="Logo" width="32" height="32"/>
      </nuxt-link>
      <button
          @click="toggleMenu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden focus:outline-none focus:ring-2 text-neutral-400 hover:bg-neutral-700 focus:ring-neutral-600"
          aria-controls="navbar-default">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="w-full md:block md:w-auto" id="navbar-default">
        <div class="absolute w-11/12 md:relative md:w-full z-50">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-neutral-800 md:bg-transparent border-neutral-700">
            <li>
              <nuxt-link to="/" class="block py-2 px-3 rounded md:p-0" @click="toggleMenu" :class="{
                'bg-white md:bg-transparent text-black md:text-neutral-400': $route.path === '/',
                'md:hover:text-neutral-400 hover:bg-neutral-700 md:hover:bg-transparent': $route.path !== '/'
              }">Accueil</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/concept" class="block py-2 px-3 rounded md:p-0" @click="toggleMenu" :class="{
                'bg-white md:bg-transparent text-black md:text-neutral-400': $route.path === '/concept',
                'md:hover:text-neutral-400 hover:bg-neutral-700 md:hover:bg-transparent': $route.path !== '/concept'
              }">Concept</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/dress-code" class="block py-2 px-3 rounded md:p-0" @click="toggleMenu" :class="{
                'bg-white md:bg-transparent text-black md:text-neutral-400': $route.path === '/dress-code',
                'md:hover:text-neutral-400 hover:bg-neutral-700 md:hover:bg-transparent': $route.path !== '/dress-code'
              }">Dress code</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/reservation" class="block py-2 px-3 rounded md:p-0" @click="toggleMenu" :class="{
                'bg-white md:bg-transparent text-black md:text-neutral-400': $route.path === '/reservation',
                'md:hover:text-neutral-400 hover:bg-neutral-700 md:hover:bg-transparent': $route.path !== '/reservation'
              }">Réservation</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>
