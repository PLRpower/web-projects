<script setup lang="ts">
import { ref } from 'vue';
const { data } = await useFetch('https://api.tnptrading.fr/home', { pick: ['questions'] })

const activeIndexes = ref<number[]>([]);

const toggleAccordion = (index: number) => {
  if (activeIndexes.value.includes(index)) {
    activeIndexes.value = activeIndexes.value.filter(i => i !== index);
  } else {
    activeIndexes.value.push(index);
  }
};
</script>

<template>
  <div class="section v2 bg-neutral-200" id="faq">
    <div class="container-default w-container">
      <div class="grid-2-columns mg-bottom-64px">
        <div class="inner-container _460px _100-mbl">
          <div class="pd-left-44px pd-left-24px-mbl border-left---neutral-800-2px">
            <h2 class="display-2 mg-bottom-0">Foire aux questions</h2>
          </div>
        </div>
      </div>
      <div class="w-layout-grid grid-1-column gap-row-0">
        <div class="sibling-opacity-item" v-for="(item, index) in data.questions" :key="index">
          <div class="accordion-item-wrapper item-simple" :class="{'first': index === 0}" @click="toggleAccordion(index)">
            <div class="accordion-content-wrapper v2">
              <div class="accordion-header">
                <h3 class="accordion-title heading-h2-size">{{ item.question }}</h3>
              </div>
              <div class="acordion-body max-w-856px" :class="{ active: activeIndexes.includes(index) }">
                <div class="accordion-spacer"></div>
                <p class="color-neutral-700 mg-bottom-0">{{ item.answer }}</p>
              </div>
            </div>
            <div class="accordion-side right-side">
              <div class="line-square-icon accordion-arrow-icon" :class="{ 'rotated-icon': activeIndexes.includes(index) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acordion-body {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.acordion-body.active {
  max-height: 500px!important;
}

.accordion-arrow-icon {
  transition: transform 0.3s ease;
  }

.rotated-icon {
  transform: rotate(90deg);
  color: black;
}
</style>