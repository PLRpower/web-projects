<script setup lang="ts">
useSeoMeta({
  title: 'CESI Drop - Accueil - Les photos & vidéos instantanées des évènements du CESI',
  ogTitle: 'CESI Drop - Accueil - Les photos & vidéos instantanées des évènements du CESI',
  description: '',
  ogDescription: '',
  ogImage: 'https://cesi-drop.osalys.studio/thumbnail.png',
  twitterCard: 'summary_large_image',
})

const categories = ref([
  { id: 1, title: 'Catégorie 1', description: 'Description de la catégorie 1' },
  { id: 2, title: 'Catégorie 2', description: 'Description de la catégorie 2' }
  // ... ajouter les autres catégories
])

const medias = ref([
  { id: 1, extname: 'webp' },
  { id: 2, extname: 'webp' }
  // ... ajouter les autres médias
])

const transformStyle = (x: number, y: number) => ({
  transform: `translate3d(${x}px, ${y}%, 0) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
  opacity: 1
})

const openPopup = (mediaId: number, extname: string) => {
  console.log(`Ouverture du popup pour ${mediaId}.${extname}`)
}
</script>

<template>
  <div class="page-wrapper">
    <SimpleNavbar />
    <div class="section">
      <div class="container-default w-container">
        <div class="inner-container" :style="transformStyle(0, 10)">
          <div class="text-center mg-bottom-64px">
            <h1 class="display-1">CESI Drop'</h1>
            <div class="inner-container _596px center">
              <p class="mg-bottom-32px">
                Découvrez les photos et les vidéos instantanément après les évènements du BDE CESI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="my-services" class="section" style="padding-top: 0">
      <div class="container-default w-container">
        <div class="mg-bottom-40px">
          <div class="w-layout-grid grid-2-columns title-and-buttons" :style="transformStyle(0, 0)">
            <div class="title-wrapper">
              <h2 class="display-3 mg-bottom-0">Les catégories</h2>
              <div class="title-line size-150px"></div>
            </div>
          </div>
        </div>

        <div class="w-layout-grid grid-4-columns services-grid" :style="transformStyle(0, 0)">
          <div v-for="categorie in categories" :key="categorie.id" class="image-top-link-wrapper w-inline-block">
            <NuxtLink :to="`/categorie/${categorie.id}`" class="card-picture-arrow">
              <div class="card-picture first">
                <img :src="`https://cesi-drop.osalys.studio/uploads/categories/${categorie.id}.webp`" :alt="categorie.title" class="service-link-image" />
              </div>
              <div class="rectangle-gradient-bg" style="opacity: 0;"></div>
              <div class="line-square-icon arrow-inside-picture" style="opacity: 0;"></div>
            </NuxtLink>
            <div class="service-link-text-container">
              <h3>{{ categorie.title }}</h3>
              <p class="mg-bottom-0">{{ categorie.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section" style="padding-top: 0; position: relative; margin: 10px;">
      <div class="container-default w-container">
        <div class="mg-bottom-40px">
          <div class="w-layout-grid grid-2-columns title-and-buttons" :style="transformStyle(0, 0)">
            <div class="title-wrapper">
              <h2 class="display-3 mg-bottom-0">Les photos</h2>
              <div class="title-line size-150px"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="freewall" class="free-wall">
        <div v-for="media in medias" :key="media.id" class="brick">
          <div class="portfolio-wrapper w-inline-block" @click="openPopup(media.id, media.extname)">
            <img :src="`https://cesi-drop.osalys.studio/uploads/${media.id}.webp`" :alt="media.id" class="card-image fit-cover" />
            <div class="rectangle-gradient-bg portfolio-project-gradient" style="opacity: 0;"></div>
            <div class="portfolio-link-btn-wrapper" style="opacity: 0; transform: translate3d(0, 15px, 0);">
              <div class="btn-primary no-hover">Afficher <span class="line-square-icon link-icon-right"></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Popup />
    <Foot />
  </div>
</template>

<style scoped>
</style>
