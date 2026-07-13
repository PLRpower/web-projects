<script setup lang="ts">
const { authenticateProvider } = useStrapiAuth()
const route = useRoute()
const router = useRouter()

const token = route.query.access_token as string

try {
    await authenticateProvider('google', token)
    router.push('/dashboard')
} catch (err) {
    router.push({
        path: '/connexion',
        query: { error: 'google_auth_failed' }
    })
}
</script>

<template>

</template>