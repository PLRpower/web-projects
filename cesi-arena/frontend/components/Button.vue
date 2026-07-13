<template>
    <NuxtLink :to="link" custom v-slot="{ href, navigate }">
        <!-- Exception pour le link -->
        <a :href="href" @click="navigate" class="button" ref="button" v-bind="$attrs">
            <span class="button__spotlight" ref="spotlight"></span>
            <span class="button__wrapper">
                <span class="button__text">
                  {{ text }}
                </span>
            </span>
        </a>
    </NuxtLink>
</template>

<script setup>
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'

defineProps(['text', 'link'])

const button = ref(null)
const spotlight = ref(null)

onMounted(() => {
    if (!button.value || !spotlight.value) return;

    button.value.addEventListener('mousemove', function(evt) {
        const movX = evt.clientX - this.getBoundingClientRect().x
        gsap.to(spotlight.value, {
            x: movX,
            scale: 20,
            duration: 0.3,
        })
    })

    button.value.addEventListener('mouseleave', function(evt) {
        const movX = evt.clientX - this.getBoundingClientRect().x
        gsap.to(spotlight.value, {
            x: movX,
            scale: 0,
            duration: 0.3,
        })
    })
})

</script>

<style scoped>
a.button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: calc(var(--spacing) * 0.3);
    border-radius: 10px;
    overflow: hidden;
    text-decoration: none;
    background: #fffce1;
}

.button__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    border-radius: 10px;
    background: #0e100f;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-inline: calc(var(--spacing) * 8);
}

a.button:hover .button__text {
    color: #0e100f;
}

.button__text {
    position: relative;
    z-index: 2;
    color: #fffce1;
    transition: 300ms ease;
}

.button__spotlight {
    position: absolute;
    z-index: 1;
    height: 10px;
    width: 10px;
    opacity: 1;
    background: #fffce1;
    border-radius: 50%;
    inset: 0;
    top: 50%;
    transform: scale(0);
}
</style>