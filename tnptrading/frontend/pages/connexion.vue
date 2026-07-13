<script setup lang="ts">
import { ref } from 'vue'

const errors = ref<string[]>([])
const form = ref<HTMLFormElement | null>(null)

const formData = ref({
  email: '',
  password: '',
})

const submitForm = async () => {
  if (form.value.checkValidity()) {
    try {
      await $fetch('http://localhost:3333/login', {
        method: 'post',
        body: formData.value
      })
      return navigateTo('/test')

    } catch (error: any) {
      const errorData = error?.data?.errors
      if (errorData && Array.isArray(errorData)) {
        errors.value = errorData.map((err: { message: string }) => err.message)
      }
    }
  } else {
    form.value.reportValidity()
  }
}

</script>

<template>
  <div class="page-wrapper">
    <WhiteNavbar />
    <div class="email-confirmation-page-main-section">
      <div class="container-default w-container">
        <div class="card email-confirmation-card">
          <h1 class="mg-bottom-24px mg-bottom-24px-mbp">Connexion</h1>
          <form class="mg-bottom-0 w-form" ref="form">
            <div v-if="errors.length" class="error-message width-100 w-form-fail mg-bottom-32px" tabindex="-1" role="region" aria-label="Email Form failure">
              <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
            </div>
            <div class="width-100">
              <div class="mg-bottom-32px">
                <InputField id="email" type="email" placeholder="Votre adresse email" label="Email" required v-model="formData.email"/>
              </div>
              <div class="mg-bottom-40px">
                <InputField id="password" type="password" placeholder="Votre mot de passe" label="Mot de passe" required v-model="formData.password"/>
              </div>
              <nuxt-link to="/mot-de-passe-oublie" class="display-block mg-bottom-24px">Mot de passe oublié ?</nuxt-link>
              <input @click="submitForm" type="button" class="btn-primary width-100 w-inline-block w-button" value="Se connecter">
            </div>
          </form>
          <div class="divider _40px"></div>
          <div class="text-center">Vous n'avez pas encore de compte ? &nbsp; <nuxt-link to="/inscription">Inscription</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <Foot />
  </div>
</template>

<style scoped>
.card.email-confirmation-card {
  min-width: 684px;
}
</style>