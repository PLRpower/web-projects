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
  <header role="banner" class="header-wrapper w-nav" data-collapse="medium">
    <div class="container-default w-container">
      <div class="header-content-wrapper">
        <nuxt-link to="/" aria-current="page" style="" class="header-logo-link w-nav-brand w--current">
          <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/logo.webp" height="100" width="100" loading="eager"/>
        </nuxt-link>
        <div class="header-middle" style="">
          <nav role="navigation" class="header-nav-menu-wrapper w-nav-menu">
            <ul role="list" class="header-nav-menu-list">
              <li class="header-nav-list-item middle sibling-opacity-item">
                <nuxt-link to="/#nos-chiffres" aria-current="page" class="header-nav-link w-nav-link w--current">Nos chiffres</nuxt-link>
              </li>
              <li class="header-nav-list-item middle sibling-opacity-item">
                <nuxt-link to="/#faq" class="header-nav-link w-nav-link">FAQ</nuxt-link>
              </li>
              <li class="header-nav-list-item middle sibling-opacity-item">
                <nuxt-link to="/#nos-services" class="header-nav-link w-nav-link">Nos services</nuxt-link>
              </li>
              <li class="header-nav-list-item middle sibling-opacity-item">
                <nuxt-link to="/#nos-avis" class="header-nav-link w-nav-link">Nos avis</nuxt-link>
              </li>
              <li class="header-nav-list-item show-in-tablet sibling-opacity-item">
                <nuxt-link to="/connexion" class="btn-primary small w-button">Connexion</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="header-right-side">
          <div class="w-commerce-commercecartwrapper cart-link-container">
            <Cart />
          </div>
          <div class="hamburger-menu-wrapper w-nav-button" @click="toggleMenu">
            <div
                :class="['hamburger-menu-bar', 'top', { 'active': isMenuOpen }]"
                :style="isMenuOpen ? 'transform: translate3d(0px, 8px, 0px) rotate(135deg);' : ''"></div>
            <div
                :class="['hamburger-menu-bar', 'bottom', { 'active': isMenuOpen }]"
                :style="isMenuOpen ? 'transform: translate3d(0px, -7px, 0px) rotate(45deg);' : ''"></div>
          </div>
          <nuxt-link to="/connexion" class="btn-primary small header-btn-hidde-on-mb w-button">Connexion</nuxt-link>
        </div>
      </div>
    </div>
    <div ref="overlay" class="w-nav-overlay" @click="closeMenu">
      <nav ref="navbar" role="navigation" class="header-nav-menu-wrapper w-nav-menu" data-nav-menu-open="" @click="closeMenu">
        <ul role="list" class="header-nav-menu-list">
          <li class="header-nav-list-item middle sibling-opacity-item">
            <nuxt-link to="/#nos-chiffres" aria-current="page" class="header-nav-link w-nav-link w--current">Nos chiffres</nuxt-link>
          </li>
          <li class="header-nav-list-item middle sibling-opacity-item">
            <nuxt-link to="/#faq" class="header-nav-link w-nav-link">FAQ</nuxt-link>
          </li>
          <li class="header-nav-list-item middle sibling-opacity-item">
            <nuxt-link to="/#nos-services" class="header-nav-link w-nav-link">Nos services</nuxt-link>
          </li>
          <li class="header-nav-list-item middle sibling-opacity-item">
            <nuxt-link to="/#nos-avis" class="header-nav-link w-nav-link">Nos avis</nuxt-link>
          </li>
          <li class="header-nav-list-item show-in-tablet sibling-opacity-item">
            <nuxt-link to="/connexion" class="btn-primary small w-button">Connexion</nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>

</template>

<style scoped>
.logo {
  height: 100px;
  width: 100px;
}

@media screen and (max-width: 991px) {
  .logo {
    height: 50px;
    width: 50px;
  }
}

.hamburger-menu-bar {
  transition: all 0.3s ease-in-out;
}
</style>