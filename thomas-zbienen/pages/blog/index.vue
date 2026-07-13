<script setup lang="ts">

</script>

<template>
  <div class="page-wrapper">
    <div class="position-relative---z-index-1">
      <div class="top-section-bg-top"></div>
      
      <Navbar />
      
      <section class="top-section">
        <div class="w-layout-blockcontainer container-default w-container">
          <div class="text-center mg-bottom-48px">
            <div class="inner-container _770px center">
              <h1 class="display-1 mg-bottom-0">Actualités & articles</h1>
              <p>Découvrez toutes les actualités et les articles de notre entreprise.</p>
            </div>
          </div>
          <div class="mg-bottom-64px w-dyn-list">
            <div role="list" class="w-dyn-items">
              <div role="listitem" class="w-dyn-item">
                <nuxt-link to="/blog/12-design-tricks-for-picking-the-perfect-home-color-palette" class="text-over-image-grid link w-inline-block">
                  <div class="text-over-image---full-width-left-wrapper" style="grid-area: 1 / 1 / 2 / 2;">
                    <div class="link-image-wrapper full-width-left">
                      <nuxt-img alt="" loading="eager" src="/img/blog/bilan_marche_2023.png" class="link-image" />
                    </div>
                  </div>
                  <div class="text-over-image---text-container v4" style="grid-area: 1 / 1 / 2 / 3;align-self: start;justify-self: end;">
                    <h2 class="link-title-dark display-2 mg-bottom-12px">Bilan du marché 2023</h2>
                    <div class="small-text-box-right v2">
                      <p class="color-neutral-600 mg-bottom-24px">Un marché de l’immobilier d’entreprise porté par les grands projets</p>
                      <div class="flex align-center">
                        <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                        <div class="divider-details"></div>
                        <div class="text-200 medium color-neutral-600">7 mai, 2024</div>
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>

    <section class="section pd-top-0---bottom-148px">
      <div class="w-layout-blockcontainer container-default w-container">
        <div class="mg-bottom-32px">
          <div class="grid-2-columns _1fr---auto gap-row-24px">
            <h2 class="display-2 mg-bottom-0">Articles récents</h2>
            <div class="w-dyn-list">
              <div role="list" class="category-links-container w-dyn-items">
                <div role="listitem" class="category-links-container w-dyn-item">
                  <nuxt-link to="/blog/categorie/tout" aria-current="page" class="text-200 category-link w-inline-block w--current">
                    <div>Tout</div>
                  </nuxt-link>
                  <div class="blog-links-divider"></div>
                  <nuxt-link to="/blog/categorie/bilans-annuels" class="text-200 category-link w-inline-block">
                    <div>Bilans annuels</div>
                  </nuxt-link>
                </div>
                <div role="listitem" class="category-links-container w-dyn-item">
                  <nuxt-link to="/blog/categorie/tout" aria-current="page" class="text-200 category-link w-inline-block w-condition-invisible w--current">
                    <div>Tout</div>
                  </nuxt-link>
                  <div class="blog-links-divider"></div>
                  <nuxt-link to="/blog/categorie/documents" class="text-200 category-link w-inline-block">
                    <div>Documents</div>
                  </nuxt-link>
                </div>
                <div role="listitem" class="category-links-container w-dyn-item">
                  <nuxt-link to="/blog/categorie/tout" aria-current="page" class="text-200 category-link w-inline-block w-condition-invisible w--current">
                    <div>Tout</div>
                  </nuxt-link>
                  <div class="blog-links-divider"></div>
                  <nuxt-link to="/blog/categorie/articles" class="text-200 category-link w-inline-block">
                    <div>Articles</div>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-dyn-list">
          <div role="list" class="grid-3-columns gap-row-64px w-dyn-items">
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2023" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Bilan marché 2023" loading="eager" src="/img/blog/bilan_marche_2023.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px" style="color: rgb(21, 19, 20);">Bilan du marché 2023</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">7 mai, 2024</div>
                </div>
              </nuxt-link>
            </div>
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2022" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Bilan marché 2022" loading="eager" src="/img/blog/bilan_marche_2022.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px" style="color: rgb(21, 19, 20);">Conditions générales de ventes</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Documents</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">15 juillet, 2019</div>
                </div>
              </nuxt-link>
            </div>
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/comment-expertiser-ses-biens-immobiliers" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Comment expertiser ses biens immobiliers" loading="eager" src="/img/blog/bilan_marche_2023.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px">Comment expertises ses biens immobiliers</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Articles</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">7 février, 2023</div>
                </div>
              </nuxt-link>
            </div>
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2022" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Bilan du marché 2022" loading="eager" src="/img/blog/bilan_marche_2022.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px">Bilan du marché 2022</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">6 mai, 2023</div>
                </div>
              </nuxt-link>
            </div>
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2021" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Bilan du marché 2021" loading="eager" src="/img/blog/bilan_marche_2021.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px" style="color: rgb(21, 19, 20);">Bilan du marché 2021</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">5 avril, 2022</div>
                </div>
              </nuxt-link>
            </div>
            <div role="listitem" class="w-dyn-item">
              <nuxt-link to="/blog/bilan-marche-2020" class="display-block text-decoration-none w-inline-block">
                <div class="link-image-wrapper mg-bottom-16px">
                  <nuxt-img alt="Bilan du marché 20202" loading="eager" src="/img/blog/bilan_marche_2020.png" class="link-image" />
                </div>
                <h3 class="link-title-dark mg-bottom-20px">Bilan du marché 2020</h3>
                <div class="flex align-center">
                  <div class="text-200 medium color-neutral-600">Bilans annuels</div>
                  <div class="divider-details"></div>
                  <div class="text-200 medium color-neutral-600">4 avril, 2021</div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div role="navigation" aria-label="List" class="w-pagination-wrapper pagination-container">
            <div aria-label="Page 1 of 2" role="heading" class="w-page-count text-200 pagination-number">1 / 2</div>
            <nuxt-link to="?page=2" aria-label="Next Page" class="w-pagination-next btn-circle-primary pagination-btn">
              <div class="line-square-icon w-inline-block"></div>
            </nuxt-link>
            <link rel="prerender" href="?page=2">
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<style scoped>
@media screen and (max-width: 767px) {
  .text-over-image---full-width-left-wrapper {
    grid-area: span 1 / span 1 / span 1 / span 1!important;
  }

  .text-over-image---text-container {
    order: -9999!important;
    grid-area: span 1 / span 1 / span 1 / span 1!important;
  }
}
</style>