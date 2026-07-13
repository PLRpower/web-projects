<script setup lang="ts">
import { onMounted, ref } from 'vue';

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
  slideWidth = slideContainer.getBoundingClientRect().width + 60;
  slides = Array.from(document.querySelectorAll('.w-slide'));

  updateSlidePosition();
});

</script>

<template>
  <div class="section overflow-hidden" id="nos-avis">
    <div class="container-default w-container">
      <div class="mg-bottom-64px">
        <div class="grid-2-columns _1fr---2-1fr gap-row-16px">
          <h2 id="w-node-f6edd83e-6430-7315-11b5-2cef6b7cd15c-185c1b84" class="display-2 mg-bottom-0" style="color: #14171e;">Découvrez l’avis de nos clients</h2>
          <div id="w-node-f6edd83e-6430-7315-11b5-2cef6b7cd15e-185c1b84" class="grid-2-columns _2fr---1fr">
            <div id="w-node-f6edd83e-6430-7315-11b5-2cef6b7cd15f-185c1b84" class="inner-container _544px _100-mbl">
              <div id="w-node-f6edd83e-6430-7315-11b5-2cef6b7cd160-185c1b84" class="pd-left-68px border-left---neutral-400-2px border-and-padding-none-tablet">
                <p class="color-neutral-700 mg-bottom-0">
                  Nos clients témoignent de la qualité de nos services et de l’impact positif sur leurs résultats. Leur satisfaction et leur succès sont au cœur de notre mission, reflétant notre engagement à fournir des solutions de trading efficaces et personnalisées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-delay="4000" data-animation="slide" class="slider-wrapper arrows-top w-slider" data-autoplay="false" data-easing="ease" data-hide-arrows="false" data-disable-swipe="false" data-autoplay-limit="0" data-nav-spacing="3" data-duration="500" data-infinite="true" role="region" aria-label="carousel">
        <div class="slider-mask width-1020px w-slider-mask" id="w-slider-mask-0">
          <div class="slide-item-mg mg-60px w-slide first" role="group" >
            <div class="card testimonials-v3">
              <div class="mg-bottom-110px mg-bottom-48px-mbl">
                <div class="display-2 font-size-28px-mbl">“TNP Trading m'a aidé à valider ma prop firm rapidement et efficacement. Leur expertise a vraiment fait la différence dans mes résultats.”</div>
              </div>
              <div class="pd-left-32px pd-left-24px-mbl border-left---neutral-800-2px">
                <div class="color-neutral-800 text-uppercase mg-bottom-12px">
                  <div class="text-200 bold letter-spacing-12em">Steeve Jobs</div>
                </div>
                <div class="text-200 medium text-uppercase">
                  <span class="color-neutral-700 letter-spacing-12em">CEO d'Apple</span>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-item-mg mg-60px w-slide" role="group">
            <div class="card testimonials-v3" aria-hidden="true">
              <div class="mg-bottom-110px mg-bottom-48px-mbl">
                <div class="display-2 font-size-28px-mbl" aria-hidden="true">“Grâce à leur gestion de compte funded, j'ai vu une amélioration significative de mes rendements. Leur approche est à la fois professionnelle et efficace.”</div>
              </div>
              <div class="pd-left-32px pd-left-24px-mbl border-left---neutral-800-2px" aria-hidden="true">
                <div class="color-neutral-800 text-uppercase mg-bottom-12px" aria-hidden="true">
                  <div class="text-200 bold letter-spacing-12em" aria-hidden="true">Paul Thomas</div>
                </div>
                <div class="text-200 medium text-uppercase" aria-hidden="true">
                  <span class="color-neutral-700 letter-spacing-12em" aria-hidden="true">CEO d'Osalys Studio</span>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-item-mg mg-60px w-slide" role="group">
            <div class="card testimonials-v3" aria-hidden="true">
              <div class="mg-bottom-110px mg-bottom-48px-mbl" aria-hidden="true">
                <div class="display-2 font-size-28px-mbl" aria-hidden="true">“Les signaux de trading fournis par TNP Trading sont incroyablement précis. Ils m'ont aidé à prendre des décisions éclairées et à maximiser mes gains.”</div>
              </div>
              <div class="pd-left-32px pd-left-24px-mbl border-left---neutral-800-2px" aria-hidden="true">
                <div class="color-neutral-800 text-uppercase mg-bottom-12px" aria-hidden="true">
                  <div class="text-200 bold letter-spacing-12em" aria-hidden="true">Rémi Porcedda</div>
                </div>
                <div class="text-200 medium text-uppercase" aria-hidden="true">
                  <span class="color-neutral-700 letter-spacing-12em" aria-hidden="true">Le boss de CESI Strasbourg</span>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-item-mg mg-60px w-slide" role="group">
            <div class="card testimonials-v3" aria-hidden="true">
              <div class="mg-bottom-110px mg-bottom-48px-mbl" aria-hidden="true">
                <div class="display-2 font-size-28px-mbl" aria-hidden="true">“Le support client de TNP Trading est exceptionnel. Ils sont réactifs, compétents, et toujours prêts à répondre à mes questions. Un vrai atout !”</div>
              </div>
              <div class="pd-left-32px pd-left-24px-mbl border-left---neutral-800-2px" aria-hidden="true">
                <div class="color-neutral-800 text-uppercase mg-bottom-12px" aria-hidden="true">
                  <div class="text-200 bold letter-spacing-12em" aria-hidden="true">Tom Burger</div>
                </div>
                <div class="text-200 medium text-uppercase" aria-hidden="true">
                  <span class="color-neutral-700 letter-spacing-12em" aria-hidden="true">Co-fondateur de TNP Trading</span>
                </div>
              </div>
            </div>
          </div>
          <div aria-live="off" aria-atomic="true" class="w-slider-aria-label"></div>
        </div>
        <div @click="previousSlide" class="slider-arrow top---left-arrow top--120px w-slider-arrow-left" role="button" tabindex="0" aria-controls="w-slider-mask-0" aria-label="previous slide">
          <div></div>
        </div>
        <div @click="nextSlide" class="slider-arrow top---right-arrow top--120px w-slider-arrow-right" role="button" tabindex="0" aria-controls="w-slider-mask-0" aria-label="next slide">
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-slide {
  transition: margin 0.4s ease-in-out;
}
</style>