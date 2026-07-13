<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
    middleware: 'auth'
})

const images = Array(20).fill('/img/Paul.jpeg')
const showOverlay = ref(false)
const rotations = ref<number[]>([])
const overlayPos = ref({ top: '50%', left: '50%' })

// Choix aléatoire d'une image "gagnante"
const winningIndex = ref(0)

onMounted(() => {
    rotations.value = images.map(() => (Math.random() * 30 - 15))
    winningIndex.value = Math.floor(Math.random() * images.length)
    console.log("Image gagnante :", winningIndex.value)
})

function onImageClick(index: number) {
    if (index === winningIndex.value) {
        // Position aléatoire pour le texte dans l'overlay
        overlayPos.value.top = `${Math.random() * 70 + 10}%`
        overlayPos.value.left = `${Math.random() * 70 + 10}%`
        showOverlay.value = true
    } else {
        // Optionnel : tu peux mettre un petit feedback ici
        // alert("Essaie encore !")
    }
}
</script>

<template>
    <div class="w-screen h-screen bg-midnight p-4 flex flex-col items-center justify-center">
        <div
            class="grid grid-cols-5 grid-rows-4 gap-3 w-full h-full max-w-[1200px] max-h-[900px]"
        >
            <div
                v-for="(img, index) in images"
                :key="index"
                class="relative cursor-pointer rounded-lg overflow-hidden border-4 border-beige/50 shadow-lg shadow-beige/20 transform transition-transform duration-500 ease-out hover:scale-110 hover:rotate-0 hover:drop-shadow-[0_10px_15px_rgba(255,255,255,0.7)]"
                :style="{
          aspectRatio: '1 / 1',
          transform: `rotate(${rotations[index]}deg)`
        }"
                @click="onImageClick(index)"
            >
                <img
                    :src="img"
                    alt="Paul"
                    class="w-full h-full object-cover brightness-90 hover:brightness-110 transition duration-300"
                    draggable="false"
                />
                <div
                    class="absolute top-0 left-0 bg-beige/90 text-midnight text-xs font-extrabold px-2 py-1 rounded-br-lg select-none pointer-events-none"
                >
                    {{ index + 1 }}
                </div>
            </div>
        </div>

        <transition name="popbounce">
            <div
                v-if="showOverlay"
                class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center select-none z-50"
                @click="showOverlay = false"
            >
                <div
                    class="text-yellow-400 font-extrabold text-5xl whitespace-nowrap animate-wiggle absolute"
                    :style="{ top: overlayPos.top, left: overlayPos.left, transform: 'translate(-50%, -50%)' }"
                >
                    TETE DE NEUILLE FREEEEEEERE
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
@keyframes popBounce {
    0% {
        transform: scale(0.7);
        opacity: 0;
    }
    60% {
        transform: scale(1.2);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
.popbounce-enter-active {
    animation: popBounce 0.4s ease forwards;
}
.popbounce-leave-active {
    animation: popBounce 0.3s ease reverse forwards;
}

@keyframes wiggle {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15% { transform: translateX(-5px) rotate(-5deg); }
    30% { transform: translateX(5px) rotate(5deg); }
    45% { transform: translateX(-5px) rotate(-5deg); }
    60% { transform: translateX(5px) rotate(5deg); }
    75% { transform: translateX(-2px) rotate(-2deg); }
}
.animate-wiggle {
    animation: wiggle 1.5s ease-in-out infinite;
}
</style>
