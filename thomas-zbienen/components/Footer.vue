<script setup lang="ts">

</script>

<template>
  <div>
    <div class="footer-top">
      <div class="w-layout-blockcontainer container-default position-relative---z-index-1 w-container">
        <div class="grid-2-columns footer-top-grid">
          <h2 class="display-1 color-neutral-100 mg-bottom-0">Travaillons ensemble</h2>
          <div class="buttons-flex-container">
            <nuxt-link to="/" class="btn-primary white w-button">Obtenez un devis <span class="line-square-icon link-icon-right mg-left-6px"></span>
            </nuxt-link>
            <nuxt-link to="/nos-services" class="btn-secondary white w-button">Nos services</nuxt-link>
          </div>
        </div>
        <div class="footer-top-section-bg">
          <nuxt-img src="/img/blog/bilan_marche_2022.png" loading="eager" alt="" class="fit-cover width-100" />
        </div>
        <div class="footer-top-section-bg bg-black-60"></div>
      </div>
      <div class="footer-top-bg-top"></div>
    </div>
    <div class="bg-accent-1">
      <div class="w-layout-blockcontainer container-default w-container">
        <div class="footer-center">
          <div class="footer-center-col">
            <nuxt-link to="/" aria-current="page" class="footer-logo-link w-inline-block w--current">
              <nuxt-img src="/img/logo-long-white.png" loading="eager" alt="Thomas Zbienen Expertises - Logo" />
            </nuxt-link>
            <p class="color-neutral-300">Expertise immobilière précise, rapide et professionnelle.</p>
            <div class="social-links-container">
              <nuxt-link to="https://fr.linkedin.com/in/thomas-zbienen-b7b118a3" target="_blank" class="social-icon-link white"></nuxt-link>
            </div>
          </div>
          <div class="footer-center-col right">
            <div class="inner-container _460px _100-tablet">
              <div class="text-300 bold footer-title">Pages principales</div>
              <div class="grid-3-columns footer-pages-grid">
                <ul role="list" class="footer-list-wrapper">
                  <li class="footer-list-item">
                    <nuxt-link to="/" class="footer-link">Accueil</nuxt-link>
                  </li>
                  <li class="footer-list-item">
                    <nuxt-link to="/about" class="footer-link">A propos</nuxt-link>
                  </li>
                  <li class="footer-list-item">
                    <nuxt-link to="/services" class="footer-link">Nos services</nuxt-link>
                  </li>
                  <li class="footer-list-item">
                    <nuxt-link to="/portfolio" class="footer-link">Actualités</nuxt-link>
                  </li>
                  <li class="footer-list-item">
                    <nuxt-link to="/portfolio" class="footer-link">Contactez-nous</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="text-300 bold footer-title">Pages utilitaires</div>
              <ul role="list" class="footer-list-wrapper">
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">CGV</nuxt-link>
                </li>
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">CGU</nuxt-link>
                </li>
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">RGPD</nuxt-link>
                </li>
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">Politique des cookies (EU)</nuxt-link>
                </li>
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">Mentions légales</nuxt-link>
                </li>
                <li class="footer-list-item">
                  <nuxt-link to="/" class="footer-link">Page administrateur</nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="color-neutral-300">Thomas Zbienen Expertises © Tous droits réservés, 2024 | Site web crée par le
            <nuxt-link to="https://osalys.studio" target="_blank" class="color-neutral-100 hover-color-neutral-400 text-decoration-none">Studio Osalys</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>