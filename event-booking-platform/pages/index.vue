<script setup lang="ts">
import { onMounted } from 'vue';

useSeoMeta({
  title: "F*cking World - Page d'accueil",
  ogTitle: "F*cking World - Page d'accueil",
  description: 'Pour le dress code une seule règle : Tout est permis ... sauf le manque de créativité !',
  ogDescription: 'Pour le dress code une seule règle : Tout est permis ... sauf le manque de créativité !',
  ogImage: '',
  twitterCard: 'summary_large_image',
})

onMounted(() => {
    const words = document.querySelectorAll('.slide-word');
    let currentIndex = 0;

    words[currentIndex].classList.add('show');

    setInterval(() => {
      words[currentIndex].classList.remove('show')
      words[currentIndex].classList.add('hide')
      words[(currentIndex + 2) % words.length].classList.remove('hide')


      currentIndex = (currentIndex + 1) % words.length;

      words[currentIndex].classList.remove('hide')
      words[currentIndex].classList.add('show')

    }, 2000);

    const textContainer = document.getElementById('text-container')
    if (textContainer) {
      setTimeout(() => {
        textContainer.classList.add('moving-text')
      }, 1000);
    }
})
</script>

<template>
  <div class="h-screen">
    <h1 class="text-6xl text-center md:text-8xl lg:text-9xl mt-48 md:mt-28 lg:mt-24" data-aos="fade-in">F*cking<br/>World</h1>
    <p class="font-variant text-2xl text-center lg:text-5x" data-aos="fade-in" data-aos-delay="200">20.06.25</p>
      <p class="font-variant text-center lg:text-5x" data-aos="fade-in" data-aos-delay="400"> (20:00 to 3:00)</p>
      <div data-aos="fade-in" data-aos-delay="400">
      <WhiteButton icon="mingcute:ticket-fill" link="/reservation" class="m-auto mt-16 lg:text-xl">
        Get your tickets
      </WhiteButton>
    </div>
    <div class="top-24 w-full absolute" >
      <nuxt-img src="/img/eclipse.webp" alt="Eclipse" class="eclipse-image w-full h-screen aspect-auto -z-10 absolute object-cover opacity-90" width="1920" height="1238" data-aos="fade-in" data-aos-delay="800"/>
    </div>
  </div>


  <div class="flex flex-col justify-center items-center gap-4 py-16">
    <h2 class="text-center text-5xl" data-aos="fade-up">Events by</h2>
    <p class="flex w-fit items-center" data-aos="fade-up" data-aos-delay="200">
      <Icon name="ph:disco-ball-fill" class="text-3xl me-2"/>
      Climate Change(s)
    </p>
    <nuxt-img src="/img/fluo.webp" loading="lazy" alt="Fluo" class="h-12 object-contain" width="828" height="421" data-aos="fade-up" data-aos-delay="400"/>
    <nuxt-img src="/img/tempete.webp" loading="lazy" alt="Tempete" class="h-8 object-contain" width="656" height="109" data-aos="fade-up" data-aos-delay="400"/>
  </div>


  <div class="text-center text-5xl font-variant py-16" data-aos="fade-up">
    <p class="me-2 bg-black z-10">F*ck</p>
    <div class="slide-container flex justify-center">
      <span class="slide-word -z-10">this</span>
      <span class="slide-word -z-10">that</span>
      <span class="slide-word -z-10">you</span>
      <span class="slide-word -z-10">the F*cking world</span>
      <span class="slide-word -z-10">off … and dance!</span>
    </div>
  </div>

  <div class="lg:flex py-16 gap-x-4 mb-4 text-5xl">
    <div class="basis-1/2 flex flex-col gap-y-4 mb-4 lg:mb-0">
      <MainImage letter="F">
        <nuxt-img src="/img/2.webp" loading="lazy" alt="1" class="w-full" width="800" height="571" data-aos="fade-up"/>
      </MainImage>
      <MainImage letter="U">
        <nuxt-img src="/img/4.webp" loading="lazy" alt="2" class="w-full" width="800" height="455" data-aos="fade-up"/>
      </MainImage>
      <MainImage letter="C">
        <nuxt-img src="/img/6.webp" loading="lazy" alt="3" class="w-full" width="800" height="533" data-aos="fade-up"/>
      </MainImage>
      <MainImage letter="K">
        <nuxt-img src="/img/7.webp" loading="lazy" alt="4" class="w-full" width="800" height="412" data-aos="fade-up"/>
      </MainImage>
    </div>
    <div class="basis-1/2 flex flex-col gap-y-4">
      <MainImage letter="I">
        <nuxt-img src="/img/1.webp" loading="lazy" alt="5" class="w-full" width="800" height="563" data-aos="fade-up"/>
      </MainImage>
      <MainImage letter="N">
        <nuxt-img src="/img/5.webp" loading="lazy" alt="6" class="w-full" width="800" height="640" data-aos="fade-up"/>
      </MainImage>
      <MainImage letter="G">
        <nuxt-img src="/img/3.webp" loading="lazy" alt="7" class="w-full" width="800" height="1081" data-aos="fade-up"/>
      </MainImage>
    </div>
  </div>

  <div class="my-24">
    <div id="text-container" class="text-4xl font-bold moving-text font-variant">
      F*cking world !
    </div>
    <WhiteButton icon="mingcute:ticket-fill" link="/reservation" class="m-auto mt-16 lg:text-xl">
    Get your tickets
  </WhiteButton>
  </div>

</template>

<style scoped>

.slide-word {
  transition: opacity 1s, transform 1s;
  transform: translateY(-40px);
  opacity: 0;
  position: absolute;
}

.slide-word.show {
  opacity: 1;
  transform: translateY(0);
}

.slide-word.hide {
  opacity: 0;
  transform: translateY(40px);
}

/* Eclipse */

.eclipse-image {
  animation: rotate 100s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes move {
  0% { transform: translateX(-100%); opacity: 0; }
  1% { opacity: 1; }
  99% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

.moving-text {
  animation: move 5s infinite linear;
}
</style>