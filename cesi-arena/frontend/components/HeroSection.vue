<template>
    <div id="gsap-hero" class="relative h-screen w-full overflow-hidden flex items-center justify-center flex-col">
        <TranslucidNavbar />

        <div id="gsap-scroll" class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <p class="text-center">Scroll</p>
            <div class="h-16 w-16 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-md shadow-lg border-2 border-white/60 cursor-pointer" @click="scrollDown">
                <Icon name="material-symbols:arrow-downward-rounded"
                      class="text-4xl animate-bounce-smooth"
                />
            </div>
        </div>

        <video class="absolute inset-0 object-cover w-full h-full"
               id="gsap-video" autoplay muted loop playsinline style="filter: blur(0px) brightness(1)"
               poster="/img/background.webp" preload="none"
        >
            <source src="/img/background.webm" type="video/mp4"/>
        </video>
        <NuxtImg id="gsap-arena" src="/img/arena.svg" alt="Arena Logo" width="1920" height="1080" style="transform: scale(60)"
             class="absolute inset-0 z-10 object-cover w-full h-full"
        />

        <div class="absolute z-20 top-[29%] left-1/2 -translate-x-1/2 text-center">
            <h1 id="gsap-title1" class="text-9xl font-extrabold" style="opacity: 0">Your fight,</h1>
            <h1 id="gsap-title2" class="text-9xl mt-8 font-extrabold" style="opacity: 0">Our Arena.</h1>
        </div>

    </div>
</template>


<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TranslucidNavbar from "~/components/TranslucidNavbar.vue";

gsap.registerPlugin(ScrollTrigger)

const scrollDown = () => {
    window.scrollBy({
        top: 900,
        behavior: 'smooth',
    })
}

onMounted(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#gsap-hero',
            start: 'top top',
            end: '+=1000',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
        },
    })

    tl
        .to('#gsap-arena', {
            scale: 1.3,
            y: -100,
            duration: 1.3,
            transformOrigin: 'center center',
            ease: 'power3.out',
        })
        .to('#gsap-video', {
            filter: 'blur(8px) brightness(0.3)',
            duration: 0.5,
            ease: 'power3',
        }, 0.5)
        .to('#gsap-scroll', {
            opacity: 0,
            ease: 'power3.inOut',
            duration: 0.5,
        }, 0)
        .to('#gsap-title1', {
            opacity: 1,
            duration: 0.5,
            ease: 'power3.inOut',
        }, 0.5)
        .to('#gsap-title2', {
            opacity: 1,
            duration: 0.5,
            ease: 'power3.inOut',
        }, 0.75)
        .to('#gsap-navbar',{
            opacity: 1,
            duration: 0.5,
            ease: 'power3.inOut',
        }, 0.7)
        .to('#gsap-translucidNavbar', {
            opacity: 0,
            duration: 0.5,
            ease: 'power3.inOut',
        }, 0)
})

onBeforeUnmount(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<style scoped>
@keyframes bounce-smooth {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(10px);
    }
}
.animate-bounce-smooth {
    animation: bounce-smooth 1.5s ease-in-out infinite;
}
</style>