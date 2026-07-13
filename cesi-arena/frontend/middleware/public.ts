export default defineNuxtRouteMiddleware(() => {
    const user = useStrapiUser()
    if (user.value) {
        return navigateTo('/')
    }
})
