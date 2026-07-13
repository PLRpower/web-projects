<script setup lang="ts">

</script>

<template>
  <section class="section">
    <div class="w-layout-blockcontainer container-default w-container">
      <div class="grid-2-columns _1-col-tablet mg-bottom-48px">
        <div class="inner-container _460px _100-tablet">
          <h2 class="display-2 mg-bottom-0">Découvrez notre processus</h2></div>
        <div class="buttons-flex-container" style="justify-content: end">
          <nuxt-link to="/contact" class="btn-primary w-button">Obtenez un devis<span class="line-square-icon link-icon-right mg-left-6px"></span></nuxt-link>
        </div>
      </div>
      <div class="grid-2-columns _1-75fr---1fr gap-row-64px">
        <div class="inner-container _728px _100-tablet">
          <div class="grid-1-column gap-row-12px">
            <div class="text-200 medium color-neutral-400">Etape 1</div>
            <div class="grid-2-columns small-title-and-paragraph-grid">
              <h3 class="display-3 mg-bottom-24px">Consultation Initiale</h3>
              <div class="inner-container _452px">
                <p class="mg-bottom-0">Nous commençons par discuter de vos besoins et recueillons les documents nécessaires pour préparer l’évaluation.</p>
              </div>
            </div>
          </div>
          <div class="divider full-width-left-divider _64px---bg-neutral-300"></div>
          <div class="grid-1-column gap-row-12px">
            <div class="text-200 medium color-neutral-400">Etape 2</div>
            <div class="grid-2-columns small-title-and-paragraph-grid">
              <h3 class="display-3 mg-bottom-24px">Analyse & Inspection</h3>
              <div class="inner-container _452px">
                <p class="mg-bottom-0">Nous effectuons une visite sur site et analysons les informations pour fournir une évaluation précise.</p>
              </div>
            </div>
          </div>
          <div class="divider full-width-left-divider _64px---bg-neutral-300"></div>
          <div class="grid-1-column gap-row-12px">
            <div class="text-200 medium color-neutral-400">Etape 3</div>
            <div class="grid-2-columns small-title-and-paragraph-grid">
              <h3 class="display-3 mg-bottom-24px">Rapport & Suivi</h3>
              <div class="inner-container _452px">
                <p class="mg-bottom-0">Nous rédigeons un rapport détaillé et vous le livrons dans les délais convenus, avec un suivi pour répondre à toutes vos questions.</p>
              </div>
            </div>
          </div>
        </div>
        <nuxt-img class="fit-cover" src="/img/processus.png"  loading="eager" alt="Découvrez notre processus - Thomas Zbienen Expertises"/>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>