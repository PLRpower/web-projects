<script setup lang="ts">
import { onMounted, ref } from 'vue';
const { data } = await useFetch('https://api.tnptrading.fr/home', { pick: ['testimonials'] })

let currentSlideIndex = ref(0);
let slideContainer: HTMLElement;
let slides: HTMLElement[] = [];
let slideWidth = 0;

function updateSlidePosition() {
  const distance = slideWidth * currentSlideIndex.value;
  slideContainer.style.marginLeft = `-${distance}px`;
}

function nextSlide() {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
  updateSlidePosition();
}

function previousSlide() {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + slides.length) % slides.length;
  updateSlidePosition();
}

onMounted(() => {
  slideContainer = document.querySelector('.w-slide') as HTMLElement;
  slideWidth = slideContainer.getBoundingClientRect().width + 28;
  slides = Array.from(document.querySelectorAll('.w-slide'));

  updateSlidePosition();
});
</script>

<template>
  <div class="section v2 overflow-hidden" id="nos-avis">
    <div class="container-default w-container">
      <div>
        <h2 class="display-2 mg-bottom-40px">Découvrez les avis de nos clients</h2>
      </div>
      <div data-delay="4000" data-animation="slide" class="slider-wrapper arrows-top mg-bottom-56px w-slider" data-autoplay="false" data-easing="ease" data-hide-arrows="false" data-disable-swipe="false" data-autoplay-limit="0" data-nav-spacing="3" data-duration="500" data-infinite="true">
        <div class="slider-mask width-404px w-slider-mask">
          <div class="slide-item-mg w-slide" v-for="(item, index) in data.testimonials" :key="index">
            <div class="card testimonials">
              <h3 class="display-3 mg-bottom-12px">“{{ item.title }}”</h3>
              <p class="color-neutral-700 mg-bottom-64px">{{ item.description }}</p>
              <div class="flex align-center">
                <nuxt-img loading="lazy" alt="Steve Jobs - TNP Trading" class="avatar-circle _03 mg-right-16px" width="64" height="64"/>
                <div>
                  <div class="color-neutral-800 mg-bottom-8px">
                    <div class="text-100 text-uppercase bold">{{ item.name }}</div>
                  </div>
                  <div class="text-100 text-uppercase medium">
                    <span class="color-neutral-700">{{ item.company }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div @click="previousSlide" class="slider-arrow top---left-arrow w-slider-arrow-left">
          <div></div>
        </div>
        <div @click="nextSlide" class="slider-arrow top---right-arrow w-slider-arrow-right">
          <div></div>
        </div>
        <div class="hidden-on-desktop w-slider-nav w-round"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.w-slide {
  transition: margin 0.4s ease-in-out;
}
</style>