<script setup lang="ts">
import { ref } from 'vue'

const isChecked = ref(false)
const currentStep = ref(1)
const form1 = ref<HTMLFormElement | null>(null)
const form2 = ref<HTMLFormElement | null>(null)
const errors = ref<string[]>([])

const formData = ref({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  birthDate: '',
  password: '',
  billingAddress: '',
  billingCity: '',
  billingPostalCode: '',
  billingCountry: '',
  billingName: '',
  vatNumber: ''
})

const nextStep = () => {
  if(form1.value.checkValidity()) {
    currentStep.value++
  } else {
    form1.value.reportValidity()
  }
}
const prevStep = () => currentStep.value--

const submitForm = async () => {
  if (form2.value.checkValidity()) {
    try {
      await $fetch('http://localhost:3333/register', {
        method: 'post',
        body: formData.value
      })
      return navigateTo('/services')

    } catch (error: any) {
      const errorData = error?.data?.errors
      if (errorData && Array.isArray(errorData)) {
        errors.value = errorData.map((err: { message: string }) => err.message)
      }
    }
  } else {
    form2.value.reportValidity()
  }
}

</script>

<template>
  <div class="page-wrapper">
    <WhiteNavbar />

    <div class="email-confirmation-page-main-section" v-if="currentStep == 1">
      <div class="container-default w-container">
        <div class="card email-confirmation-card">
          <h1 class="mg-bottom-24px mg-bottom-24px-mbp">Inscription</h1>
          <div class="mg-bottom-0 w-form">
            <form class="width-100" ref="form1">
              <div class="mg-bottom-32px flex-horizontal gap-40px">
                <div class="width-100">
                  <InputField id="lastName" type="text" placeholder="Votre nom" label="Nom" required v-model="formData.lastName" />
                </div>
                <div class="width-100">
                  <InputField id="firstName" type="text" placeholder="Votre prénom" label="Prénom" required v-model="formData.firstName" />
                </div>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="email" type="email" placeholder="Votre adresse email" label="Email" required v-model="formData.email"/>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="phone" type="tel" placeholder="Votre numéro de téléphone" label="Téléphone" required v-model="formData.phone"/>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="birthDate" type="date" placeholder="Votre date de naissance" label="Date de naissance" required v-model="formData.birthDate"/>
              </div>
              <div class="mg-bottom-40px">
                <InputField id="password" type="password" placeholder="Votre mot de passe" label="Mot de passe" required v-model="formData.password"/>
              </div>
              <div class="mg-bottom-32px">
                <label class="w-checkbox flex align-center pd-left-0">
                  <div :class="['w-checkbox-input', 'w-checkbox-input--inputType-custom', 'checkbox', { 'w--redirected-checked': isChecked }]"></div>
                  <input type="checkbox" id="checkbox" name="checkbox" v-model="isChecked" style="opacity: 0; position: absolute; z-index: -1"/>
                  <span class="color-neutral-600 mg-bottom-0 w-form-label" for="checkbox">
                  J'ai lu et agrée les
                  <nuxt-link to="#">Conditions générales</nuxt-link>.
                </span>
                </label>
              </div>
              <input @click="nextStep" type="button" class="btn-primary width-100 w-inline-block w-button" :class="{ 'disabled': !isChecked}" :disabled='!isChecked' value="Suivant">
            </form>
          </div>
          <div class="divider _40px"></div>
          <div class="text-center">Vous avez déjà un compte ? &nbsp; <nuxt-link to="/connexion">Connexion</nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="email-confirmation-page-main-section" v-if="currentStep == 2">
      <div class="container-default w-container">
        <div class="card email-confirmation-card">
          <h1 class="mg-bottom-24px mg-bottom-24px-mbp">Facturation</h1>
          <div class="mg-bottom-0 w-form">
            <form class="width-100" ref="form2">
              <div v-if="errors.length" class="error-message width-100 w-form-fail mg-bottom-32px" tabindex="-1" role="region" aria-label="Email Form failure">
                <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="billingAddress" type="text" placeholder="Votre adresse" label="Adresse" required v-model="formData.billingAddress"/>
              </div>
              <div class="mg-bottom-32px flex-horizontal gap-40px">
                <div class="width-100">
                  <InputField id="billingCity" type="text" placeholder="Votre ville" label="Ville" required v-model="formData.billingCity"/>
                </div>
                <div class="width-100">
                  <InputField id="billingPostalCode" type="text" placeholder="Votre code postal" label="Code postal" required v-model="formData.billingPostalCode"/>
                </div>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="billingCountry" type="text" placeholder="Votre pays" label="Pays" required v-model="formData.billingCountry"/>
              </div>
              <div class="mg-bottom-32px">
                <InputField id="billingName" type="text" placeholder="Votre société" label="Société (Optionnel)" v-model="formData.billingName"/>
              </div>
              <div class="mg-bottom-40px">
                <InputField id="vatNumber" type="text" placeholder="Votre numéro de TVA" label="Numéro de TVA (Optionnel)" v-model="formData.vatNumber"/>
              </div>
              <input type="button" @click="submitForm" data-wait="Patientez ..." class="btn-primary width-100 w-inline-block w-button mg-bottom-16px" value="S'inscrire">
              <input type="button" @click="prevStep" class="btn-secondary width-100 w-inline-block w-button" value="Précédent">
            </form>
          </div>
        </div>
      </div>
    </div>

    <Foot />
  </div>
</template>

<style scoped>
@media (min-width: 767px) {
  .card.email-confirmation-card {
    min-width: 684px;
  }
}

@media (max-width: 767px) {
  .flex-horizontal {
    flex-direction: column;
  }

  .container-default {
    width: 90%;
  }
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.disabled:hover {
  transform: none;
}
</style>