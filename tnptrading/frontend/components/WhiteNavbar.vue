<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
const navbar = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  const isOpen = isMenuOpen.value

  if (navbar.value && overlay.value) {
    document.body.classList.toggle('no-scroll', isOpen)

    navbar.value.style.transform = isOpen ? 'translateY(0)' : 'translateY(-350px)'
    overlay.value.style.background = isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
    overlay.value.style.visibility = isOpen ? 'visible' : 'hidden'
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  const isOpen = isMenuOpen.value

  if (navbar.value && overlay.value) {
    document.body.classList.toggle('no-scroll', isOpen)

    navbar.value.style.transform = isOpen ? 'translateY(0)' : 'translateY(-350px)'
    overlay.value.style.background = isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
    overlay.value.style.visibility = isOpen ? 'visible' : 'hidden'
  }
}
</script>

<template>
  <div role="banner" class="header-wrapper w-nav" data-collapse="medium">
    <div class="container-default w-container">
      <div class="header-content-wrapper">

        <div class="header-left-side"></div>

        <div class="header-middle">
          <nuxt-link to="/" aria-current="page" style="display: flex; align-items: center" class="header-logo-link w-nav-brand w--current">
            <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/logo.webp" height="75" width="75" loading="eager"/>
            <h2 class="display-2 mg-bottom-0 text-center mg-left-12px">TNP Trading</h2>
          </nuxt-link>
        </div>

        <div class="header-right-side"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.logo {
  height: 75px;
  width: 75px;
}

@media screen and (max-width: 991px) {
  .logo {
    height: 50px;
    width: 50px;
  }
}
</style>