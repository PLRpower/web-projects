<script setup lang="ts">
import { useCookie } from 'nuxt/app'
import { useCart } from '@/composables/cart'

const cartCookie = useCookie('cart')
const { isCartVisible, toggleCartVisibility } = useCart()

function addQuantityById(cartId) {
  cartCookie.value.find((item: CartItem) => item.id === cartId)!.quantity += 1
  toggleCartVisibility()
}
</script>

<template>
  <div class="section v2 overflow-hidden" id="nos-services">
    <div class="container-default w-container">
      <div class="mg-bottom-40px">
        <div class="inner-container _60 _100-mbl">
          <div class="pd-left-44px pd-left-24px-mbl border-left---neutral-800-2px">
            <h2 class="display-2 mg-bottom-0">Découvrez les différents services que nous proposons</h2>
          </div>
        </div>
      </div>
      <div class="flex gap-24px services">
        <nuxt-link @click="addQuantityById(1)" class="card services text-decoration-none">
          <nuxt-img src="/img/wallet.svg" loading="lazy" alt="Validation de Propfirm - TNP Trading" class="mg-bottom-48px" width="40" height="44" />
          <h3 class="display-4 mg-bottom-12px">Validation de Propfirm</h3>
          <p class="color-neutral-700 mg-bottom-0">
            Confiez nous votre propfirm, nous nous chargons de valider vos challenges pour faire de vous un trader financé !
          </p>
        </nuxt-link>
        <nuxt-link @click="addQuantityById(2)" class="card services text-decoration-none">
          <nuxt-img src="/img/card.svg" loading="lazy" alt="Gestion de compte funded - TNP Trading" class="mg-bottom-48px" width="52" height="44" />
          <h3 class="display-4 mg-bottom-12px">Gestion de compte funded</h3>
          <p class="color-neutral-700 mg-bottom-0">
            Votre propfirm est validée ? Confiez nous la gestion de celle-ci, nous nous chargons d'effectuer des gains !
          </p>
        </nuxt-link>
        <nuxt-link @click="addQuantityById(3)" class="card services text-decoration-none">
          <nuxt-img src="/img/signal.svg" loading="lazy" alt="Canal de signaux trading - TNP Trading" class="mg-bottom-48px" width="46" height="44" />
          <h3 class="display-4 mg-bottom-12px">Canal de signaux trading</h3>
          <p class="color-neutral-700 mg-bottom-0">
            Recevez des signaux de trading précis pour prendre des décisions éclairées et saisir les meilleures opportunités du marché.
          </p>
        </nuxt-link>
      </div>

    </div>
  </div>

</template>

<style scoped>
.card.services {
  flex-basis: 33%;
  transition: all .2s ease-in-out;
}

.card.services:hover {
  cursor: pointer;
  transform: translateY(-4px);
  background-color: var(--neutral--300);
}

.services {
  align-items: stretch;
  flex-direction: row;
}

@media screen and (max-width: 767px) {
  .services {
    flex-direction: column;
  }
}
</style>