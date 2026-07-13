<script setup lang="ts">
import { ref } from 'vue';

const activeIndexes = ref<number[]>([]);

const toggleAccordion = (index: number) => {
  if (activeIndexes.value.includes(index)) {
    activeIndexes.value = activeIndexes.value.filter(i => i !== index);
  } else {
    activeIndexes.value.push(index);
  }
};
</script>


<template>
  <section class="section">
    <div class="w-layout-blockcontainer container-default w-container">
      <div class="grid-2-columns _1fr---1-35fr gap-row-64px">
        <div class="sticky-top static-mbl" style="grid-area: span 1 / span 1 / span 1 / span 1; align-self: start">
          <div class="inner-container _440px _100-mbl">
            <h2 class="display-2 mg-bottom-0">Question fréquentes</h2>
          </div>
          <div class="inner-container _468px _100-mbl">
            <p class="mg-bottom-24px">Découvrez les réponses aux questions les plus courantes.</p>
          </div>
        </div>
        <div class="inner-container _648px _100-mbl" ref="accordion" style="justify-self: end">
          <div class="accordion-item-wrapper" @click="toggleAccordion(0)">
            <div class="accordion-content-wrapper">
              <div class="accordion-header max-w-410px">
                <h3 class="display-4 mg-bottom-0">Qu'est-ce qu'une expertise immobilière et pourquoi en ai-je besoin ?</h3>
              </div>
              <div class="acordion-body max-w-510px" :class="{ active: activeIndexes.includes(0) }">
                <div class="accordion-spacer"></div>
                <p class="mg-bottom-0">Une expertise immobilière est une évaluation professionnelle de la valeur d'un bien immobilier, réalisée par un expert qualifié. Cette évaluation est essentielle dans diverses situations, telles que l'achat ou la vente d'un bien, le règlement d'une succession, l'obtention d'un prêt hypothécaire, ou encore pour des raisons fiscales. Elle permet d'assurer que le bien est correctement évalué en fonction des conditions actuelles du marché, ce qui protège les intérêts financiers des parties impliquées.</p>
              </div>
            </div>
            <div class="accordion-side">
              <div class="accordion-icon-wrapper">
                <div :class="{ 'rotated-icon': activeIndexes.includes(0) }"></div>
              </div>
            </div>
          </div>
          <div class="divider _56px bg-neutral-300"></div>

          <div class="accordion-item-wrapper" @click="toggleAccordion(1)">
            <div class="accordion-content-wrapper">
              <div class="accordion-header max-w-410px">
                <h3 class="display-4 mg-bottom-0">Comment est calculée la valeur d’un bien lors d'une expertise immobilière ?</h3>
              </div>
              <div class="acordion-body max-w-510px" :class="{ active: activeIndexes.includes(1) }">
                <div class="accordion-spacer"></div>
                <p class="mg-bottom-0">La valeur d’un bien immobilier est calculée en tenant compte de plusieurs facteurs déterminants. L’expert analyse l’emplacement géographique, la surface, l'état général du bien, les caractéristiques spécifiques (telles que l'architecture, les matériaux utilisés, etc.), ainsi que les tendances du marché local. Des comparaisons avec des ventes récentes de biens similaires dans la même zone sont également effectuées pour établir une estimation précise.
                </p>
              </div>
            </div>
            <div class="accordion-side">
              <div class="accordion-icon-wrapper">
                <div :class="{ 'rotated-icon': activeIndexes.includes(1) }"></div>
              </div>
            </div>
          </div>
          <div class="divider _56px bg-neutral-300"></div>

          <div class="accordion-item-wrapper" @click="toggleAccordion(2)">
            <div class="accordion-content-wrapper">
              <div class="accordion-header max-w-410px">
                <h3 class="display-4 mg-bottom-0">Quels types de biens immobiliers peuvent être expertisés ?</h3>
              </div>
              <div class="acordion-body max-w-510px" :class="{ active: activeIndexes.includes(2) }">
                <div class="accordion-spacer"></div>
                <p class="mg-bottom-0">Tous les types de biens immobiliers peuvent faire l'objet d'une expertise. Cela inclut les résidences principales ou secondaires, les appartements, les terrains à bâtir, les locaux commerciaux ou industriels, ainsi que les propriétés agricoles. Chaque type de bien a ses propres critères d'évaluation, et l’expert adaptera son analyse en fonction de la nature spécifique du bien à expertiser.</p>
              </div>
            </div>
            <div class="accordion-side">
              <div class="accordion-icon-wrapper">
                <div :class="{ 'rotated-icon': activeIndexes.includes(2) }"></div>
              </div>
            </div>
          </div>
          <div class="divider _56px bg-neutral-300"></div>

          <div class="accordion-item-wrapper" @click="toggleAccordion(3)">
            <div class="accordion-content-wrapper">
              <div class="accordion-header max-w-410px">
                <h3 class="display-4 mg-bottom-0">Quelles sont les méthodes d’évaluation utilisées dans une expertise immobilière ?</h3>
              </div>
              <div class="acordion-body max-w-510px" :class="{ active: activeIndexes.includes(3) }">
                <div class="accordion-spacer"></div>
                <p class="mg-bottom-0">Plusieurs méthodes d’évaluation sont utilisées pour estimer la valeur d’un bien immobilier. La méthode comparative analyse les prix de vente de biens similaires dans la même région. L'approche par le revenu estime la valeur basée sur le potentiel de revenus générés par le bien, ce qui est particulièrement pertinent pour les biens locatifs. Enfin, la méthode du coût de remplacement évalue combien il en coûterait pour reconstruire le bien en question, en tenant compte de l'usure et de la dépréciation. Chaque méthode est appliquée selon le type de bien et le contexte de l'<expertise class=""></expertise></p>
              </div>
            </div>
            <div class="accordion-side">
              <div class="accordion-icon-wrapper">
                <div :class="{ 'rotated-icon': activeIndexes.includes(3) }"></div>
              </div>
            </div>
          </div>
          <div class="divider _56px bg-neutral-300"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.acordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.acordion-body.active {
  max-height: 500px; /* Ajustez selon la taille du contenu */
  transition: max-height 0.3s ease-in;
}

.accordion-icon-wrapper .rotated-icon {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}
</style>