<script setup lang="ts">
const { data } = await useFetch('https://api.tnptrading.fr/home', { pick: ['numbers'] })
</script>

<template>
  <div class="section v2" id="nos-chiffres">
    <div class="container-default w-container">
      <div class="grid-2-columns _1fr---2fr gap-row-64px">
        <div id="w-node-_913830aa-210a-eb51-64fe-58858245ab14-4acba64a" class="sticky-top static-mbl">
          <h2 class="display-2 mg-bottom-32px">Découvrez nos chiffres clés</h2>
        </div>
        <div id="w-node-_034ef10e-7869-eab5-14a2-95716693e039-4acba64a" class="grid-2-columns gap-row-110px gap-row-40px-mbl">
          <div v-for="(item, index) in data.numbers" :key="index" class="number-item">
            <div class="flex align-end mg-bottom-8px">
              <div class="font-size-124px color-neutral-800">{{ item.number }}</div>
              <div v-if="item.symbol" class="mg-bottom-12px mg-bottom-6px-mbl mg-bottom-2px-mbp">
                <div class="display-2 color-neutral-600 mg-left-12px">{{ item.symbol }}</div>
              </div>
            </div>
            <h3 class="display-3">{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-neutral-600 {
  color: #586e82!important;
}
</style>