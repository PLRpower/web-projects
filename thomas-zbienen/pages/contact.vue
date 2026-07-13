<script setup lang="ts">

</script>

<template>
  <div class="page-wrapper">
    <div class="position-relative---z-index-1">
      <Navbar />
      <section class="top-section pd-bottom-120px">
        <div class="w-layout-blockcontainer container-default w-container">
          <div class="grid-2-columns contact-form-left-grid">
            <div class="inner-container _574px _100-tablet" style="grid-area: span 1 / span 1 / span 1 / span 1;">
              <div class="form-block contact-form-block w-form">
                <form id="wf-form-Contact-V3-Form" name="wf-form-Contact-V3-Form" data-name="Contact" method="get">
                  <div class="grid-2-columns main-form-grid">
                    <div>
                      <label for="Name">Nom</label>
                      <input class="input w-input" maxlength="256" name="Name" data-name="Name" placeholder="Paul Thomas" type="text" id="Name" required />
                    </div>
                    <div>
                      <label for="Email">Email</label>
                      <input class="input w-input" maxlength="256" name="Email" data-name="Email" placeholder="paul@gmail.com" type="email" id="Email" required />
                    </div>
                    <div>
                      <label for="Phone">Téléphone</label>
                      <input class="input w-input" maxlength="256" name="Phone" data-name="Phone" placeholder="06 07 08 09 10" type="tel" id="Phone" required />
                    </div>
                    <div>
                      <label for="Service">Entreprise</label>
                      <input class="input w-input" maxlength="256" name="Service" data-name="Service" placeholder="SNCF" type="text" id="Service" required />
                    </div>
                    <div class="c-msg"  style="grid-area: span 1 / span 2 / span 1 / span 2;">
                      <label for="Message">Message</label>
                      <textarea id="Message" name="Message" maxlength="5000" data-name="Message" placeholder="Dites-nous en plus sur votre projet..." class="text-area w-input"></textarea>
                    </div>
                    <input type="submit" data-wait="Please wait..." class="btn-primary w-button" value="Envoyer le message" />
                  </div>
                </form>
                <div class="success-message-transparent w-form-done">
                  <div class="line-square-icon success-message-icon"></div>
                  <h3 class="heading-h2-size">Merci !</h3>
                  <div>Merci pour votre message. Nous allons vous recontacter dans les plus brefs délais.</div>
                </div>
                <div class="error-message outlined w-form-fail">
                  <div>Oups ! Une erreur est survenue, veuillez réessayer plus tard.</div>
                </div>
              </div>
            </div>
            <div class="inner-container _428px _100-tablet c-container2" style="grid-area: span 1 / span 1 / span 1 / span 1; justify-self: end">
              <h1 class="display-1 mg-bottom-4px">Travaillons ensemble</h1>
              <p class="mg-bottom-32px">Remplissez le formule ci-contre pour être recontacté dans les plus brefs délais.</p>
              <div class="_2-contact-links-container">
                <div class="grid-1-column gap-row-4px">
                  <div>Email</div>
                  <nuxt-link to="mailto:contact@thomas-zbienen.fr" class="text-200 medium text-decoration-none">contact@thomas-zbienen.fr</nuxt-link>
                </div>
                <div class="grid-1-column gap-row-4px">
                  <div>Téléphone</div>
                  <nuxt-link to="tel:0608241956" class="text-200 medium text-decoration-none">06 08 24 19 56</nuxt-link>
                </div>
              </div>
              <div class="divider full-width-right-divider _40px---bg-neutral-300"></div>
              <div class="grid-2-columns _1fr---auto">
                <div class="text-200 medium"></div>
                <div class="social-links-container">
                  <nuxt-link to="https://fr.linkedin.com/in/thomas-zbienen-b7b118a3" target="_blank" class="social-icon-link"></nuxt-link>
                  <nuxt-link to="https://clubimmo67.fr/membres" target="_blank" class="social-icon-link" style="max-width: 80px; display: flex; align-items: center">
                    <nuxt-img src="/img/club-immo-black.png"></nuxt-img>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="section-bg-left v6"></div>
    </div>

    <FAQ />

    <div class="overflow-hidden">
      <section class="section pd-148px position-relative---z-index-1">
        <div class="w-layout-blockcontainer container-default w-container">
          <div class="inner-container _444px center">
            <h2 class="display-2 text-center mg-bottom-48px">Visit our offices around the globe</h2>
          </div>
          <div class="grid-2-columns gap-row-64px">
            <div>
              <img src="https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0c9_los-angeles-office-image-large-construktion-webflow-ecommerce-template.jpg" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 95vw, (max-width: 991px) 46vw, (max-width: 1439px) 47vw, 620px" srcset="https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0c9_los-angeles-office-image-large-construktion-webflow-ecommerce-template-p-500.jpg 500w, https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0c9_los-angeles-office-image-large-construktion-webflow-ecommerce-template-p-800.jpg 800w, https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0c9_los-angeles-office-image-large-construktion-webflow-ecommerce-template.jpg 1240w" alt="Los Angeles - Construktion X Webflow Template" class="width-100 mg-bottom-32px" />
              <h3 class="display-3 mg-bottom-4px">Los Angeles, CA</h3>
              <div class="inner-container _574px _100-mbl">
                <p class="mg-bottom-32px">Lorem ipsum dolor sit amet consectetur. Pulvinar mauris amet pulvinar placerat eget mattis sed. Nisl congue ultricies urna.</p>
              </div>
              <div class="_2-contact-links-container max-w-456px">
                <div class="grid-1-column gap-row-4px">
                  <div>Email</div>
                  <nuxt-link to="mailto:contact@thomas-zbienen.fr" class="text-200 medium text-decoration-none">losangeles@construktion.com</nuxt-link>
                </div>
                <div class="grid-1-column gap-row-4px">
                  <div>Téléphone</div>
                  <nuxt-link to="tel:0608241956" class="text-200 medium text-decoration-none">06 08 24 19 56</nuxt-link>
                </div>
              </div>
              <div class="divider full-width-left-divider top-40px---bottom-0---bg-neutral-300"></div>
            </div>
            <div>
              <img src="https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0d2_new-york-office-image-large-construktion-webflow-ecommerce-template.jpg" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 95vw, (max-width: 991px) 46vw, (max-width: 1439px) 47vw, 620px" srcset="https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0d2_new-york-office-image-large-construktion-webflow-ecommerce-template-p-500.jpg 500w, https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0d2_new-york-office-image-large-construktion-webflow-ecommerce-template-p-800.jpg 800w, https://assets-global.website-files.com/651b13749f485695ddba524e/6525a71ee59385170b5fe0d2_new-york-office-image-large-construktion-webflow-ecommerce-template.jpg 1240w" alt="New York - Construktion X Webflow Template" class="width-100 mg-bottom-32px" />
              <h3 class="display-3 mg-bottom-4px">New York, NY</h3>
              <div class="inner-container _574px _100-mbl">
                <p class="mg-bottom-32px">Lorem ipsum dolor sit amet consectetur. Pulvinar mauris amet pulvinar placerat eget mattis sed. Nisl congue ultricies urna.</p>
              </div>
              <div class="_2-contact-links-container max-w-456px">
                <div class="grid-1-column gap-row-4px">
                  <div>Email</div>
                  <nuxt-link to="mailto:contact@thomas-zbienen.fr" class="text-200 medium text-decoration-none">contact@thomas-zbienen.fr</nuxt-link>
                </div>
                <div class="grid-1-column gap-row-4px">
                  <div>Téléphone</div>
                  <nuxt-link to="tel:0608241956" class="text-200 medium text-decoration-none">06 08 24 19 56</nuxt-link>
                </div>
              </div>
              <div class="divider full-width-right-divider top-40px---bottom-0---bg-neutral-300"></div>
            </div>
          </div>
        </div>
        <div class="section-bg-top"></div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
@media screen and (max-width: 991px) {
  .c-container2 {
    order: -9999;
    justify-self: auto;
  }
}

@media screen and (max-width: 479px) {
  .c-msg {
    grid-column: span 1 / span 1!important;
  }
}
</style>