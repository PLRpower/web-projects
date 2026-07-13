<script setup lang="ts">

</script>

<template>
  <section class="top-section large-image-right">
    <div class="w-layout-blockcontainer container-default w-container">
      <div class="grid-2-columns _1-5fr---1fr _1-col-tablet">
        <div class="position-relative---z-index-1">
          <h1 class="display-1">
            Révélez la valeur de votre bien <span class="display-1-heading-line-right">&nbsp;</span>
          </h1>
          <div class="inner-container _422px">
            <p class="color-neutral-800 mg-bottom-32px">
              Obtenez une évaluation précise et fiable de votre propriété grâce à notre expertise professionnelle et nos outils avancés.
            </p>
          </div>
          <div class="buttons-flex-container">
            <nuxt-link to="/contact" class="btn-primary w-button">
              Obtenez un devis <span class="line-square-icon link-icon-right mg-left-6px"></span>
            </nuxt-link>
            <nuxt-link to="/a-propos" class="btn-secondary w-button">En découvrir +</nuxt-link>
          </div>
        </div>
        <div class="top-section---image-right-wrapper">
          <div class="bg-overlay w40"></div>
          <nuxt-img src="/img/landing.png" alt="Révélez la valeur de votre bien - Thomas Zbienen Expertises" class="fit-cover width-100" />
        </div>
      </div>
      <div class="scroll-down-button-right-container">
        <div>
          <nuxt-link to="#services" class="btn-circle-secondary _140px black w-inline-block">
            <nuxt-img src="/img/arrow.svg" loading="eager" alt="Flèche vers le bas - Thomas Zbienen Expertises" class="large-button-white-icon" style="filter: brightness(0%)" />
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="top-section-bg-bottom"></div>
  </section>

</template>

<style scoped>
@keyframes moveArrow {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  80% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

.large-button-white-icon {
  animation: moveArrow 1.5s ease-in-out infinite;
  width: 50px;
}

.btn-circle-secondary:hover .large-button-white-icon {
  filter: brightness(100%)!important;
}
</style>