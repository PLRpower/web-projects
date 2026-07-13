<script setup lang="ts">
import { ref } from 'vue'

const { login, getProviderAuthenticationUrl } = useStrapiAuth()
const router = useRouter()
const identifier = ref('')
const password = ref('')
const errorMessage = ref('')


onMounted(() => {
    const route = useRoute()
    if (route.query.error === 'google_auth_failed') {
        errorMessage.value = 'Votre compte a été créé sans Google. Veuillez saisir votre email et votre mot de passe.'
    }
})

const onSubmit = async () => {
    errorMessage.value = ''
    try {
        await login({ identifier: identifier.value, password: password.value })
        router.push('/dashboard')
    } catch (error) {
        errorMessage.value = 'Identifiants incorrects. Veuillez réessayer.'
    }
}

const withGoogle = () => {
    window.location.href = getProviderAuthenticationUrl('google')
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div class="max-w-[480px] w-full">
            <NuxtLink to="/">
                <NuxtImg src="/img/logo.png" alt="logo" class="w-40 mb-8 mx-auto block" />
            </NuxtLink>

            <div class="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
                <h1 class="text-center text-3xl font-semibold">Connexion</h1>

                <button @click="withGoogle" class="items-center flex justify-center gap-x-4 mt-6 w-full py-4 px-4 text-[15px] font-medium tracking-wide rounded-md bg-neutral-800 hover:bg-neutral-700 focus:outline-2 cursor-pointer">
                    <Icon name="simple-icons:google" class="fs-16"></Icon>
                    Continuer avec Google
                </button>

                <p class="text-center py-4">Ou</p>

                <form class="space-y-6" @submit.prevent="onSubmit">
                    <div>
                        <label class="text-sm font-medium mb-2 block">Email</label>
                        <div class="relative flex items-center">
                            <input
                                v-model="identifier"
                                name="email"
                                type="email"
                                required
                                class="w-full text-sm border border-neutral-700 px-4 py-3 pr-8 rounded-md focus:outline-2"
                                placeholder="Votre email"
                                autocomplete="email"
                            />
                            <Icon name="material-symbols:person" class="w-4 h-4 absolute right-4 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-medium mb-2 block">Mot de passe</label>
                        <div class="relative flex items-center">
                            <input
                                v-model="password"
                                name="password"
                                type="password"
                                required
                                class="w-full text-sm border border-neutral-700 px-4 py-3 pr-8 rounded-md focus:outline-2"
                                placeholder="Votre mot de passe"
                                autocomplete="current-password"
                            />
                            <Icon name="material-symbols:visibility-off-rounded" class="w-4 h-4 absolute right-4 cursor-pointer" />
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-saumon focus:outline-0 border-neutral-700 rounded accent-saumon bg-gray-700" />
                            <label for="remember-me" class="ml-3 block text-sm">
                                Se souvenir ?
                            </label>
                        </div>
                        <div class="text-sm">
                            <NuxtLink to="/mdp-oublie" class="text-saumon hover:underline font-semibold focus:outline-2">
                                Mot de passe oublié ?
                            </NuxtLink>
                        </div>
                    </div>

                    <div class="!mt-12">
                        <button type="submit" class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md bg-saumon hover:bg-saumon/80 focus:outline-2 cursor-pointer">
                            Se connecter
                        </button>
                    </div>

                    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                        {{ errorMessage }}
                    </p>

                    <p class="text-sm !mt-6 text-center">
                        Vous n'avez pas de compte ?
                        <NuxtLink to="/inscription" class="text-saumon hover:underline ml-1 whitespace-nowrap font-semibold focus:outline-2">
                            Créez vous un compte
                        </NuxtLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>
