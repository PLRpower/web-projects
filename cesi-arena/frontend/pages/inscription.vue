<script setup lang="ts">
import { ref } from 'vue'
const { register, getProviderAuthenticationUrl } = useStrapiAuth()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const onSubmit = async () => {
    errorMessage.value = ''
    try {
        await register({
            username: username.value,
            email: email.value,
            password: password.value,
        })
        router.push('/authenticated-page')
    } catch (error: any) {
        errorMessage.value = 'Erreur lors de l’inscription. Veuillez vérifier les informations fournies.'
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
                <h1 class="text-center text-3xl font-semibold">Créer un compte</h1>

                <button @click="withGoogle" class="items-center flex justify-center gap-x-4 mt-6 w-full py-4 px-4 text-[15px] font-medium tracking-wide rounded-md bg-neutral-800 hover:bg-neutral-700 focus:outline-2 cursor-pointer">
                    <Icon name="simple-icons:google" class="fs-16"></Icon>
                    Continuer avec Google
                </button>

                <p class="text-center py-4">Ou</p>

                <form class="space-y-6" @submit.prevent="onSubmit">
                    <div>
                        <label class="text-sm font-medium mb-2 block">Nom d’utilisateur</label>
                        <input
                            v-model="username"
                            type="text"
                            name="username"
                            required
                            class="w-full text-sm border border-neutral-700 px-4 py-3 rounded-md focus:outline-2"
                            placeholder="Votre nom d’utilisateur"
                        />
                    </div>

                    <div>
                        <label class="text-sm font-medium mb-2 block">Email</label>
                        <input
                            v-model="email"
                            type="email"
                            name="email"
                            required
                            class="w-full text-sm border border-neutral-700 px-4 py-3 rounded-md focus:outline-2"
                            placeholder="Votre email"
                            autocomplete="email"
                        />
                    </div>

                    <div>
                        <label class="text-sm font-medium mb-2 block">Mot de passe</label>
                        <input
                            v-model="password"
                            type="password"
                            name="password"
                            required
                            class="w-full text-sm border border-neutral-700 px-4 py-3 rounded-md focus:outline-2"
                            placeholder="Votre mot de passe"
                            autocomplete="new-password"
                        />
                    </div>

                    <div class="!mt-12">
                        <button type="submit" class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md bg-saumon hover:bg-saumon/80 focus:outline-2 cursor-pointer">
                            S’inscrire
                        </button>
                    </div>

                    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                        {{ errorMessage }}
                    </p>

                    <p class="text-sm !mt-6 text-center">
                        Vous avez déjà un compte ?
                        <NuxtLink to="/connexion" class="text-saumon hover:underline ml-1 whitespace-nowrap font-semibold focus:outline-2">
                            Connectez-vous
                        </NuxtLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>
