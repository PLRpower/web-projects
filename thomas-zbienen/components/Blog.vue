<script setup lang="ts">

</script>

<template>
  <section class="section">
    <div class="w-layout-blockcontainer container-default w-container">
      <div class="grid-2-columns _1-col-tablet mg-bottom-48px">
        <div class="inner-container _400px _100-tablet">
          <h2 class="display-2 mg-bottom-0">Découvrez nos news et articles</h2></div>
        <div class="buttons-flex-container" style="justify-content: end">
          <nuxt-link to="/blog" class="btn-secondary w-button">Voir tout les articles</nuxt-link>
        </div>
      </div>
      <div class="grid-2-columns _1-25fr---1fr gap-row-64px">
        <div class="w-dyn-list">
          <div role="list" class="w-dyn-items">
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2023" class="grid-1-column gap-row-40px text-decoration-none w-inline-block" >
                <div class="link-image-wrapper">
                  <nuxt-img loading="eager" alt="Bilan du marché 2023" src="/img/blog/bilan_marche_2023.png" class="link-image" />
                </div>
                <div>
                  <h3 class="link-title-dark display-3 mg-bottom-24px">BILAN DU MARCHÉ 2023</h3>
                  <div class="flex align-center">
                    <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                    <div class="divider-details"></div>
                    <div class="text-200 medium color-neutral-600">7 mai, 2024</div>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
        <div class="inner-container _522px _100-mbl">
          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">
              <div role="listitem" class="collection-item-divider-bottom w-dyn-item">
                <nuxt-link to="/blog/CGV" class="display-block text-decoration-none w-inline-block">
                  <h3 class="link-title-dark display-3 mg-bottom-20px">Conditions générales de ventes</h3>
                  <div class="flex align-center">
                    <div class="text-200 medium color-neutral-600">Documents</div>
                    <div class="divider-details"></div>
                    <div class="text-200 medium color-neutral-600">15 juillet, 2019</div>
                  </div>
                </nuxt-link>
              </div>
              <div role="listitem" class="collection-item-divider-bottom w-dyn-item">
                <nuxt-link to="/blog/comment-expertises-ses-biens-immobiliers" class="display-block text-decoration-none w-inline-block">
                  <h3 class="link-title-dark display-3 mg-bottom-20px">Comment expertiser ses biens immobiliers</h3>
                  <div class="flex align-center">
                    <div class="text-200 medium color-neutral-600">Articles</div>
                    <div class="divider-details"></div>
                    <div class="text-200 medium color-neutral-600">7 février, 2023</div>
                  </div>
                </nuxt-link>
              </div>
              <div role="listitem" class="collection-item-divider-bottom w-dyn-item">
                <nuxt-link to="/blog/bilan-marche-2022" class="display-block text-decoration-none w-inline-block">
                  <h3 class="link-title-dark display-3 mg-bottom-20px">Bilan du marché 2022</h3>
                  <div class="flex align-center">
                    <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                    <div class="divider-details"></div>
                    <div class="text-200 medium color-neutral-600">6 mai, 2023</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>