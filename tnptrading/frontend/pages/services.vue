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
  <div class="page-wrapper">
    <Navbar />
    <div class="position-relative---z-index-1">
      <div class="top-section pd-bottom-200px bg-transparent">
        <div class="container-default w-container">
          <div class="inner-container _584px center">
            <div class="text-center mg-bottom-48px">
              <h1 class="display-1 color-neutral-100">Nos services</h1>
              <p class="color-neutral-300 mg-bottom-0">
                Chez TNPtrading, nous vous offrons une gamme de services professionnels pour vous accompagner dans votre parcours de trader. Que vous soyez débutant ou expérimenté, nous avons les solutions adaptées à vos besoins.
              </p>
            </div>
          </div>
          <div class="grid-3-columns _1-col-tablet gap-40px">
            <div class="sibling-opacity-item w-dyn-list">
              <div role="list" class="w-dyn-items">
                <div role="listitem" class="w-dyn-item">
                  <nuxt-link @click="addQuantityById(1)" class="card pricing-card w-inline-block">
                    <nuxt-img src="/img/wallet.svg" loading="lazy" alt="Validation de Propfirm - TNP Trading" class="mg-bottom-48px" width="60" height="66" />
                    <div class="color-neutral-800">
                      <div class="text-400 medium mg-bottom-8px">Validation de Propfirm</div>
                    </div>
                    <div class="color-neutral-700">
                      Confiez nous votre propfirm, nous nous chargons de valider vos challenges pour faire de vous un trader financé !
                    </div>
                    <div class="flex align-end mg-top-20px">
                      <div class="display-3 mg-right-8px">100€</div>
                    </div>
                    <div class="divider _40px"></div>
                    <div class="text-200 bold mg-bottom-20px">
                      <span class="color-neutral-800">Ce qui est inclus :</span>
                    </div>
                    <div class="grid-1-column gap-row-16px mg-bottom-56px">
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Analyse de vos objectifs</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Stratégie de trading optimisée</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Accompagnement personnalisé</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Reporting détaillé</div>
                      </div>
                    </div>
                    <div class="btn-primary hover-none mg-top-auto">Ajouter au panier</div>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="sibling-opacity-item w-dyn-list">
              <div role="list" class="height-100 w-dyn-items">
                <div role="listitem" class="height-100 w-dyn-item">
                  <nuxt-link @click="addQuantityById(2)" class="card pricing-card w-inline-block">
                    <nuxt-img src="/img/card.svg" loading="lazy" alt="Gestion de compte funded - TNP Trading" class="mg-bottom-48px" width="78" height="66" />
                    <div class="color-neutral-800">
                      <div class="text-400 medium mg-bottom-8px">Gestion de compte funded</div>
                    </div>
                    <div class="color-neutral-700">
                      Votre propfirm est validée ? Confiez nous la gestion de celle-ci, nous nous chargons d'effectuer des gains !
                    </div>
                    <div class="flex align-end mg-top-20px">
                      <div class="display-3 mg-right-8px">30% *</div>
                      <div class="heading-h4">sur les gains</div>
                    </div>
                    <div class="divider _40px"></div>
                    <div class="text-200 bold mg-bottom-20px">
                      <span class="color-neutral-800">Ce qui est inclus :</span>
                    </div>
                    <div class="grid-1-column gap-row-16px mg-bottom-56px">
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Gestion active du compte</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Stratégies de gestion du risque</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24"/>
                        <div class="text-200 color-neutral-800">Rapports de performance mensuels</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24" />
                        <div class="text-200 color-neutral-800">Support client dédié</div>
                      </div>
                    </div>
                    <div class="btn-primary hover-none mg-top-auto">Ajouter au panier</div>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="sibling-opacity-item w-dyn-list">
              <div role="list" class="height-100 w-dyn-items">
                <div role="listitem" class="height-100 w-dyn-item">
                  <nuxt-link @click="addQuantityById(3)" class="card pricing-card w-inline-block">
                    <nuxt-img src="/img/signal.svg" loading="lazy" alt="Canal de signaux trading - TNP Trading" class="mg-bottom-48px" width="69" height="66" />
                    <div class="color-neutral-800">
                      <div class="text-400 medium mg-bottom-8px">Canal de signaux trading</div>
                    </div>
                    <div class="color-neutral-700">
                      Recevez des signaux de trading précis pour prendre des décisions éclairées et saisir les meilleures opportunités du marché.
                    </div>
                    <div class="flex align-end mg-top-20px">
                      <div class="display-3 mg-right-8px">10€</div>
                      <div class="heading-h4">/mois</div>
                    </div>
                    <div class="divider _40px"></div>
                    <div class="text-200 bold mg-bottom-20px">
                      <span class="color-neutral-800">Ce qui est inclus :</span>
                    </div>
                    <div class="grid-1-column gap-row-16px mg-bottom-56px">
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24" />
                        <div class="text-200 color-neutral-800">Signaux en temps réel</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24" />
                        <div class="text-200 color-neutral-800">Analyses techniques et fondamentales</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24" />
                        <div class="text-200 color-neutral-800">Conseils de gestion du risque</div>
                      </div>
                      <div class="flex align-start">
                        <nuxt-img src="/img/check.svg" loading="eager" alt="" class="translate-y--4px mg-right-12px" height="24" width="24" />
                        <div class="text-200 color-neutral-800">Support direct avec les analystes</div>
                      </div>
                    </div>
                    <div class="btn-primary hover-none mg-top-auto">Ajouter au panier</div>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-neutral-800 bottom-44 border-radius-bottom-118px" style="background-color: #14171e;"></div>
    </div>
    <Foot />
  </div>
</template>

<style scoped>
.pricing-card {
  cursor: pointer;
}
</style>