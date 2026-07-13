<script setup lang="ts">

</script>

<template>
  <div class="page-wrapper">
    <WhiteNavbar />
      <div class="email-confirmation-page-main-section">
        <div class="container-default w-container">
          <div class="card email-confirmation-card">
            <div class="inner-container _48px-mbp">
              <nuxt-img src="/img/email.svg" loading="eager" alt="Confirmez votre email - TNP Trading" class="mg-bottom-48px" />
            </div>
            <h1 class="display-2 mg-bottom-12px">Confirmez votre email</h1>
            <div class="color-neutral-700 mg-bottom-40px">Pour accéder à votre compte, veuillez confirmer votre adresse email en cliquant sur le lien que nous vous avons envoyé.</div>
            <nuxt-link to="https://www.gmail.com" target="_blank" rel="nofollow noopener noreferrer" class="btn-primary width-100 mg-bottom-16px w-button">Ouvrir Gmail</nuxt-link>
            <nuxt-link to="https://outlook.live.com/" target="_blank" rel="nofollow noopener noreferrer" class="btn-secondary width-100 w-button">Ouvrir Outlook</nuxt-link>
          </div>
        </div>
      </div>
    <Foot />
  </div>
</template>

<style scoped>

</style>