<script setup lang="ts">
useSeoMeta({
  title: "F*cking World - Dress code",
  ogTitle: "F*cking World - Dress code",
  description: 'Bienvenue ou là où tout est possible, où tout est F*cking World !',
  ogDescription: 'Bienvenue ou là où tout est possible, où tout est F*cking World !',
  ogImage: '',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="my-24">
    <div class="text-center mb-16">
      <h1 class="font-variant text-3xl lg:text-6xl mb-16" data-aos="fade-up">Dress code</h1>
      <p class="font-neutral-700 text-xl lg:text-2xl mb-16"  data-aos="fade-up" data-aos-delay="200">Tout est permis ...<br> sauf le manque de créativité !</p>
      <p class="font-neutral-700 text-xl lg:text-2xl"  data-aos="fade-up" data-aos-delay="400">Sources d'inspiration pour celles et ceux<br> qui manquent toutefois d'imagination : </p>
    </div>
    <DressCodeImage title="Burning-man" data-aos="fade-up">
      <nuxt-img src="/img/burning-man.webp" alt="Burning man" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Heroes of WW2" data-aos="fade-up">
      <nuxt-img src="/img/heroes.webp" alt="Heroes of WW2" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Woodstock" data-aos="fade-up">
      <nuxt-img src="/img/woodstock.webp" alt="Woodstock" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Walt Disney" data-aos="fade-up">
      <nuxt-img src="/img/walt-disney.webp" alt="Walt Disney" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Science-fiction" data-aos="fade-up">
      <nuxt-img src="/img/science-fiction.webp" alt="Science-fiction" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Mad max" data-aos="fade-up">
      <nuxt-img src="/img/mad-max.webp" alt="Mad max" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Dune" data-aos="fade-up">
      <nuxt-img src="/img/dune.webp" alt="Dune" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Le parrain" data-aos="fade-up">
      <nuxt-img src="/img/le-parrain.webp" alt="Le parrain" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Pop culture" data-aos="fade-up">
      <nuxt-img src="/img/pop-culture.webp" alt="Pop culture" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="God save the King/Queen" data-aos="fade-up">
      <nuxt-img src="/img/god-save.webp" alt="God save the King/Queen" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
    <DressCodeImage title="Cultures populaires" data-aos="fade-up">
      <nuxt-img src="/img/cultures-populaires.webp" alt="Cultures populaires" class="w-full" width="1200" height="350"/>
    </DressCodeImage>
  </div>
</template>

<style scoped>
</style>