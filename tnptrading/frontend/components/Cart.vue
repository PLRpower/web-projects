<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '@/composables/cart'
import { useCookie } from 'nuxt/app'

const { isCartVisible, toggleCartVisibility } = useCart()
const cartCookie = useCookie('cart')

const initialCart = [
  { id: 1, name: 'Validation de Propfirm', price: '100€', quantity: 0 },
  { id: 2, name: 'Gestion de compte funded', price: '30% *', quantity: 0 },
  { id: 3, name: 'Canal de signaux trading', price: '10€/mois', quantity: 0 }
]

if (!cartCookie.value) {cartCookie.value = initialCart}

const totalQuantity = computed(() => cartCookie.value.reduce((acc, item) => acc + item.quantity, 0))

const totalCost = computed(() => cartCookie.value.reduce((acc, item) => acc + item.quantity * (item.id === 1 ? 100 : item.id === 2 ? 0 : 10), 0))

const nonEmptyCart = computed(() => cartCookie.value.filter(item => item.quantity > 0))

function updateQuantity(cartId, newQuantity) {
  cartCookie.value.find((item: CartItem) => item.id === cartId)!.quantity = newQuantity
}

function deleteService(cartId) {
  cartCookie.value.find((item: CartItem) => item.id === cartId)!.quantity = 0
}
</script>


<template>
  <nuxt-link @click="toggleCartVisibility" class="w-commerce-commercecartopenlink cart-button w-inline-block" role="button" aria-haspopup="dialog" aria-label="Ouvrir le panier">
    <div class="w-inline-block">
      <nuxt-img src="/img/panier.svg" alt="Panier - TNP Trading" width="32" height="32" style="width: 32px" loading="eager"/>
    </div>
    <div class="w-commerce-commercecartopenlinkcount cart-quantity" style="padding-bottom: 10px">{{ totalQuantity }}</div>
  </nuxt-link>
  <div v-if="isCartVisible" @click="toggleCartVisibility" class="w-commerce-commercecartcontainerwrapper w-commerce-commercecartcontainerwrapper--cartType-modal">
    <div role="dialog" @click="toggleCartVisibility" class="w-commerce-commercecartcontainer cart-container">
      <div class="w-commerce-commercecartheader cart-header">
        <h4 class="w-commerce-commercecartheading">Votre panier</h4>
        <nuxt-link @click="toggleCartVisibility" class="w-commerce-commercecartcloselink w-inline-block" role="button" aria-label="Fermer le panier" style="cursor: pointer">
          <svg width="16px" height="16px" viewBox="0 0 16 16">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g fill-rule="nonzero" fill="#333333">
                <polygon points="6.23223305 8 0.616116524 13.6161165 2.38388348 15.3838835 8 9.76776695 13.6161165 15.3838835 15.3838835 13.6161165 9.76776695 8 15.3838835 2.38388348 13.6161165 0.616116524 8 6.23223305 2.38388348 0.616116524 0.616116524 2.38388348 6.23223305 8"></polygon>
              </g>
            </g>
          </svg>
        </nuxt-link>
      </div>
      <div class="w-commerce-commercecartformwrapper">
        <form v-if="nonEmptyCart.length > 0" class="w-commerce-commercecartform">
          <div class="w-commerce-commercecartlist">
            <div class="w-commerce-commercecartitem" v-for="service in nonEmptyCart" :key="service.id">
              <nuxt-img v-if="service.id == 1" src="/img/wallet.svg" loading="lazy" alt="Validation de Propfirm - TNP Trading" width="44" />
              <nuxt-img v-if="service.id == 2" src="/img/card.svg" loading="lazy" alt="Gestion de compte funded - TNP Trading" width="44" />
              <nuxt-img v-if="service.id == 3" src="/img/signal.svg" loading="lazy" alt="Canal de signaux trading - TNP Trading" width="44" />
              <div class="w-commerce-commercecartiteminfo">
                <div class="w-commerce-commercecartproductname color-neutral-800">{{ service.name }}</div>
                <div>{{ service.price }}</div>
                <nuxt-link @click="deleteService(service.id)" class="w-inline-block" aria-label="Supprimer le service du panier" style="cursor: pointer; width: fit-content">
                  <div>Supprimer</div>
                </nuxt-link>
              </div>
              <input class="w-commerce-commercecartquantity input cart-quantity-input" required pattern="^[0-9]+$" inputMode="numeric" type="number" name="quantity" autoComplete="off" @input="updateQuantity(service.id, service.quantity)" v-model.number="service.quantity" />
            </div>
          </div>
          <div class="w-commerce-commercecartfooter">
            <div aria-atomic="false" class="w-commerce-commercecartlineitem">
              <div>Sous-total (à payer maintenant)</div>
              <div class="w-commerce-commercecartordervalue">{{ totalCost }}€</div>
            </div>
            <div>
              <nuxt-link to="/" value="Continuer" class="w-commerce-commercecartcheckoutbutton btn-primary">Continuer</nuxt-link>
            </div>
          </div>
        </form>
        <div v-else class="w-commerce-commercecartemptystate">
          <div>Aucun service dans le panier.</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>