<script setup lang="ts">
// Faire une ref pour la
const isMenuOpen = ref(false)

</script>

<template>
  <div data-animation="default" class="header-wrapper w-nav" data-w-id="3e4eae5f-c9fd-c051-dc9f-9317b4043bae" role="banner">
    <div class="container-default w-container">
      <div data-w-id="3a2c735b-74cf-4645-547f-b126475df4c5" class="header-content-wrapper grid">
        <div class="header-left-side">
          <div class="hamburger-menu-wrapper w-nav-button" @click="isMenuOpen = !isMenuOpen">
            <div class="hamburger-menu-bar top"></div>
            <div class="hamburger-menu-bar bottom"></div>
          </div>
        </div>
        <div class="header-middle">
          <nuxt-link to="/" class="header-logo-link w-nav-brand">
            <img src="/img/logo_full.svg" alt="Logo CESI Drop" style="width: 250px" />
          </nuxt-link>
        </div>
        <div class="header-right-side">
          <div class="social-media-flex-top hidden-on-tablet">
            <a href="https://discord.gg/xUJ3AYv3xb" target="_blank" rel="noopener noreferrer nofollow" class="social-icon-link w-inline-block">
              <div class="social-icon-font"></div>
            </a>
            <a href="https://www.instagram.com/studio.cesi/" target="_blank" rel="noopener noreferrer nofollow" class="social-icon-link w-inline-block">
              <div class="social-icon-font"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="w-nav-overlay" style="height: 8157.2px; display: block;">
      <nav role="navigation" class="header-nav-menu-wrapper hamburger-desktop w-nav-menu" style="transform: translateY(0px) translateX(0px); transition: all, transform 300ms;" data-nav-menu-open="">
      <div class="header-nav-menu-content" style="transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; filter: blur(0px); opacity: 1;">
        <ul role="list" class="dropdown-sub-list-wrapper">
          <li class="header-nav-list-item">
            <a href="/" data-w-id="3a2c735b-74cf-4645-547f-b126475df4d3" class="header-nav-link display-4 w-nav-link w--current w--nav-link-open" style="max-width: 1360px;">Accueil <span class="line-square-icon link-icon-right mg-left-12px" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"></span>
            </a>
          </li>
          <li class="header-nav-list-item">
            <a href="/publier" data-w-id="3a2c735b-74cf-4645-547f-b126475df4d8" class="header-nav-link display-4 w-nav-link w--nav-link-open" style="max-width: 1360px;">Publier <span class="line-square-icon link-icon-right mg-left-12px"></span>
            </a>
          </li>
          <!--
          <li class="header-nav-list-item">
            <a href="/contact" data-w-id="3a2c735b-74cf-4645-547f-b126475df4ec" class="header-nav-link display-4 w-nav-link">Contact <span class="line-square-icon link-icon-right mg-left-12px"></span>
            </a>
          </li>
          -->
        </ul>
      </div>
    </nav>
    </div>
  </div>
</template>

<style scoped>
</style>
