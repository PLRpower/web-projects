<script setup lang="ts">

</script>

<template>
  <div class="page-wrapper">
    <WhiteNavbar />
    <div class="section overflow-hidden" style="padding-top: 10px">
      <div class="container-default w-container">

        <nuxt-link to="mailto:contact@tnptrading.fr" class="card mg-bottom-40px">
          <div class="line-rounded-icon" style="height: 40px"></div>
          <div class="margin">
            <h3 class="display-4 mg-bottom-12px">Notre mail</h3>
            <p class="color-neutral-700 mg-bottom-0">
              contact@tnptrading.fr
            </p>
          </div>
        </nuxt-link>

        <nuxt-link to="https://t.me/Paul_TNP" class="card mg-bottom-40px" target="_blank" rel="nofollow noopener noreferrer">
          <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/telegram.webp" height="44" width="44" loading="eager"/>
          <div class="margin">
            <h3 class="display-4 mg-bottom-12px">Contact direct avec nous!</h3>
            <p class="color-neutral-700 mg-bottom-0">
              t.me/Paul_TNP
            </p>
          </div>
        </nuxt-link>

        <nuxt-link to="https://t.me/+ME6mheVt09FlMDk8" class="card mg-bottom-40px" target="_blank" >
          <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/telegram.webp" height="44" width="44" loading="eager"/>
          <div class="margin">
            <h3 class="display-4 mg-bottom-12px">TNP Results</h3>
            <p class="color-neutral-700 mg-bottom-0">
              t.me/+ME6mheVt09FlMDk8
            </p>
          </div>
        </nuxt-link>

        <nuxt-link to="https://www.instagram.com/tnptrading_" class="card mg-bottom-40px" target="_blank" rel="nofollow noopener noreferrer">
          <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/instagram.webp" height="44" width="44" loading="eager"/>
          <div class="margin">
            <h3 class="display-4 mg-bottom-12px">Instagram</h3>
            <p class="color-neutral-700 mg-bottom-0">
              instagram.com/tnptrading_
            </p>
          </div>
        </nuxt-link>

        <nuxt-link to="/" class="card mg-bottom-40px">
          <nuxt-img alt="TNP Trading - Logo" class="logo" src="/img/logo.webp" height="44" width="44" loading="eager"/>
          <div class="margin">
            <h3 class="display-4 mg-bottom-12px">Notre site web</h3>
            <p class="color-neutral-700 mg-bottom-0">
              tnptrading.fr
            </p>
          </div>
        </nuxt-link>

      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.margin {
  margin-left: 20px;
}

.line-rounded-icon {
  font-size: 36px;
  color: #222;
}

.card {
  text-decoration: none;
  align-items: center;
  display: flex;
  padding: 40px;
  transition: all .2s ease-in-out;
}

.card:hover {
  background-color: var(--neutral--300);
  transform: translateY(-5px);
}
</style>