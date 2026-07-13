import { useState } from 'nuxt/app'

export const useCart = () => {
    const isCartVisible = useState('isCartVisible', () => false)

    const toggleCartVisibility = () => {
        isCartVisible.value = !isCartVisible.value
    }

    return {
        isCartVisible,
        toggleCartVisibility
    }
}