<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
const navbar = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  const isOpen = isMenuOpen.value

  if (navbar.value && overlay.value) {
    document.body.classList.toggle('no-scroll', isOpen)

    navbar.value.style.transform = isOpen ? 'translateY(0)' : 'translateY(-350px)'
    overlay.value.style.background = isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
    overlay.value.style.visibility = isOpen ? 'visible' : 'hidden'
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  const isOpen = isMenuOpen.value

  if (navbar.value && overlay.value) {
    document.body.classList.toggle('no-scroll', isOpen)

    navbar.value.style.transform = isOpen ? 'translateY(0)' : 'translateY(-350px)'
    overlay.value.style.background = isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
    overlay.value.style.visibility = isOpen ? 'visible' : 'hidden'
  }
}
</script>


<template>
  <div data-collapse="medium" role="banner" class="header-wrapper w-nav">

    <div class="container-default w-container">
      <div class="header-content-wrapper border-neutral-300">
        <div class="header-left-side">
          <nuxt-link to="/" class="header-logo-link w-nav-brand">
            <nuxt-img src="/img/logo-black.png" style="width: 50px" alt="Thomas Zbienen Expertises - Logo" />
          </nuxt-link>
          <nav role="navigation" class="header-nav-menu-wrapper w-nav-menu">
            <ul role="list" class="header-nav-menu-list">
              <li class="header-nav-list-item">
                <nuxt-link to="/" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">Accueil</nuxt-link>
              </li>
              <li class="header-nav-list-item">
                <nuxt-link to="/a-propos" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">A propos</nuxt-link>
              </li>
              <li class="header-nav-list-item">
                <div class="dropdown-wrapper w-dropdown" style="max-width: 1316px;">
                  <div class="dropdown-toggle color-neutral-800 w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                    <div>Nos services</div>
                    <div class="line-rounded-icon dropdown-arrow" ></div>
                  </div>
                  <nav class="dropdown-list w-dropdown-list" style="display: none; opacity: 0; transform: translate3d(-30%, 10px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; width: 832.812px; height: 0px;" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0">
                    <div class="dropdown-card">
                      <div class="w-layout-grid grid-2-columns dropdown-pages-grid">
                        <div>
                          <div class="text-200 bold dropdown-title">Main pages</div>
                          <div class="w-layout-grid grid-3-columns dropdown-main-pages-grid">
                            <div class="w-layout-grid grid-1-column dropdown-link-column">
                              <a href="/" class="dropdown-link w-dropdown-link" tabindex="0">Home (Sales)</a>
                              <a href="/home-pages/home-v1" class="dropdown-link w-dropdown-link" tabindex="0">Home V1</a>
                              <a href="/home-pages/home-v2" class="dropdown-link w-dropdown-link" tabindex="0">Home V2</a>
                              <a href="/home-pages/home-v3" class="dropdown-link w-dropdown-link" tabindex="0">Home V3</a>
                              <a href="/about" class="dropdown-link w-dropdown-link" tabindex="0">About</a>
                              <a href="/services" class="dropdown-link w-dropdown-link" tabindex="0">Services</a>
                              <a href="https://construktiontemplate.webflow.io/services/project-planning" class="dropdown-link w-dropdown-link" tabindex="0">Service single</a>
                              <a href="/portfolio" class="dropdown-link w-dropdown-link" tabindex="0">Portfolio</a>
                            </div>
                            <div class="w-layout-grid grid-1-column dropdown-link-column">
                              <a href="https://construktiontemplate.webflow.io/projects/house-architecture-design-in-los-angeles-ca" class="dropdown-link w-dropdown-link" tabindex="0">Portfolio single</a>
                              <a href="/blog-pages/blog-v1" class="dropdown-link w-dropdown-link" tabindex="0">Blog V1</a>
                              <a href="/blog-pages/blog-v2" class="dropdown-link w-dropdown-link" tabindex="0">Blog V2</a>
                              <a href="/blog-pages/blog-v3" aria-current="page" class="dropdown-link w-dropdown-link w--current" tabindex="0">Blog V3</a>
                              <a href="https://construktiontemplate.webflow.io/blog/25-color-trends-designers-cant-wait-to-see-in-2025" class="dropdown-link w-dropdown-link" tabindex="0">Blog post</a>
                              <a href="/team" class="dropdown-link w-dropdown-link" tabindex="0">Team</a>
                              <a href="https://construktiontemplate.webflow.io/team/john-carter" class="dropdown-link w-dropdown-link" tabindex="0">Team member</a>
                            </div>
                            <div class="w-layout-grid grid-1-column dropdown-link-column">
                              <a href="/shop" class="dropdown-link w-dropdown-link" tabindex="0">Shop</a>
                              <a href="https://construktiontemplate.webflow.io/product/outdoor-chair" class="dropdown-link w-dropdown-link" tabindex="0">Shop single</a>
                              <a href="/contact-pages/contact-v1" class="dropdown-link w-dropdown-link" tabindex="0">Contact V1</a>
                              <a href="/contact-pages/contact-v2" class="dropdown-link w-dropdown-link" tabindex="0">Contact V2</a>
                              <a href="/contact-pages/contact-v3" class="dropdown-link w-dropdown-link" tabindex="0">Contact V3</a>
                              <a href="/request-a-quote" class="dropdown-link w-dropdown-link" tabindex="0">Request a quote</a>
                              <a href="/coming-soon" class="dropdown-link w-dropdown-link" tabindex="0">Coming soon</a>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="text-200 bold dropdown-title">Utility pages</div>
                          <div class="w-layout-grid grid-1-column dropdown-link-column">
                            <a href="/template-pages/style-guide" class="dropdown-link w-dropdown-link" tabindex="0">Styleguide</a>
                            <a href="/template-pages/start-here" class="dropdown-link w-dropdown-link" tabindex="0">Start here</a>
                            <a href="https://construktiontemplate.webflow.io/404" class="dropdown-link w-dropdown-link" tabindex="0">404 not found</a>
                            <a href="https://construktiontemplate.webflow.io/401" class="dropdown-link w-dropdown-link" tabindex="0">Password protected</a>
                            <a href="/template-pages/licenses" class="dropdown-link w-dropdown-link" tabindex="0">Licenses</a>
                            <a href="/template-pages/changelog" class="dropdown-link w-dropdown-link" tabindex="0">Changelog</a>
                            <a href="https://brixtemplates.com/more-webflow-templates" target="_blank" class="dropdown-link medium w-dropdown-link" tabindex="0">More Webflow Templates</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </li>
              <li class="header-nav-list-item">
                <nuxt-link to="/blog" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">Actualités</nuxt-link>
              </li>
              <li class="header-nav-list-item show-in-tablet">
                <nuxt-link to="/contact" class="btn-primary small w-button">Contact <span class="line-square-icon link-icon-right mg-left-6px"></span>
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="header-right-side">
          <div class="social-links-container hidden-on-mbl">
            <nuxt-link to="tel:0608241956" target="_blank" class="header-nav-link color-neutral-800 w-nav-link" style="font-weight: 600; width: 190px">
              06 08 24 19 56
            </nuxt-link>
            <nuxt-link to="https://fr.linkedin.com/in/thomas-zbienen-b7b118a3" target="_blank" class="social-icon-link"></nuxt-link>
            <nuxt-link to="https://clubimmo67.fr/membres" target="_blank" class="social-icon-link" style="max-width: 80px; display: flex; align-items: center">
              <nuxt-img src="/img/club-immo-black.png"></nuxt-img>
            </nuxt-link>
          </div>
          <div class="hidden-on-tablet">
            <nuxt-link to="/contact" class="btn-primary small w-button">
              Contact <span class="line-square-icon link-icon-right mg-left-6px"></span>
            </nuxt-link>
          </div>
          <div class="hamburger-menu-wrapper w-nav-button" @click="toggleMenu">
            <div
                :class="['hamburger-menu-bar', 'top', 'bg-neutral-800', { 'active': isMenuOpen }]"
                :style="isMenuOpen ? 'transform: translate3d(0px, 8px, 0px) rotate(135deg);' : ''"></div>
            <div
                :class="['hamburger-menu-bar', 'bottom', 'bg-neutral-800', { 'active': isMenuOpen }]"
                :style="isMenuOpen ? 'transform: translate3d(0px, -7px, 0px) rotate(45deg);' : ''"></div>
          </div>
        </div>
      </div>
    </div>

    <div ref="overlay" class="w-nav-overlay" @click="closeMenu">
      <nav ref="navbar" role="navigation" class="header-nav-menu-wrapper w-nav-menu" data-nav-menu-open="" @click="closeMenu">
        <ul role="list" class="header-nav-menu-list">
          <li class="header-nav-list-item">
            <nuxt-link to="/" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">Accueil</nuxt-link>
          </li>
          <li class="header-nav-list-item">
            <nuxt-link to="/a-propos" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">A propos</nuxt-link>
          </li>
          <li class="header-nav-list-item">
            <div class="dropdown-wrapper w-dropdown" style="max-width: 1316px;">
              <div class="dropdown-toggle color-neutral-800 w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                <div>Nos services</div>
                <div class="line-rounded-icon dropdown-arrow" ></div>
              </div>
              <nav class="dropdown-list w-dropdown-list" style="display: none; opacity: 0; transform: translate3d(-30%, 10px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; width: 832.812px; height: 0px;" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0">
                <div class="dropdown-card">
                  <div class="w-layout-grid grid-2-columns dropdown-pages-grid">
                    <div>
                      <div class="text-200 bold dropdown-title">Main pages</div>
                      <div class="w-layout-grid grid-3-columns dropdown-main-pages-grid">
                        <div class="w-layout-grid grid-1-column dropdown-link-column">
                          <a href="/" class="dropdown-link w-dropdown-link" tabindex="0">Home (Sales)</a>
                          <a href="/home-pages/home-v1" class="dropdown-link w-dropdown-link" tabindex="0">Home V1</a>
                          <a href="/home-pages/home-v2" class="dropdown-link w-dropdown-link" tabindex="0">Home V2</a>
                          <a href="/home-pages/home-v3" class="dropdown-link w-dropdown-link" tabindex="0">Home V3</a>
                          <a href="/about" class="dropdown-link w-dropdown-link" tabindex="0">About</a>
                          <a href="/services" class="dropdown-link w-dropdown-link" tabindex="0">Services</a>
                          <a href="https://construktiontemplate.webflow.io/services/project-planning" class="dropdown-link w-dropdown-link" tabindex="0">Service single</a>
                          <a href="/portfolio" class="dropdown-link w-dropdown-link" tabindex="0">Portfolio</a>
                        </div>
                        <div class="w-layout-grid grid-1-column dropdown-link-column">
                          <a href="https://construktiontemplate.webflow.io/projects/house-architecture-design-in-los-angeles-ca" class="dropdown-link w-dropdown-link" tabindex="0">Portfolio single</a>
                          <a href="/blog-pages/blog-v1" class="dropdown-link w-dropdown-link" tabindex="0">Blog V1</a>
                          <a href="/blog-pages/blog-v2" class="dropdown-link w-dropdown-link" tabindex="0">Blog V2</a>
                          <a href="/blog-pages/blog-v3" aria-current="page" class="dropdown-link w-dropdown-link w--current" tabindex="0">Blog V3</a>
                          <a href="https://construktiontemplate.webflow.io/blog/25-color-trends-designers-cant-wait-to-see-in-2025" class="dropdown-link w-dropdown-link" tabindex="0">Blog post</a>
                          <a href="/team" class="dropdown-link w-dropdown-link" tabindex="0">Team</a>
                          <a href="https://construktiontemplate.webflow.io/team/john-carter" class="dropdown-link w-dropdown-link" tabindex="0">Team member</a>
                        </div>
                        <div class="w-layout-grid grid-1-column dropdown-link-column">
                          <a href="/shop" class="dropdown-link w-dropdown-link" tabindex="0">Shop</a>
                          <a href="https://construktiontemplate.webflow.io/product/outdoor-chair" class="dropdown-link w-dropdown-link" tabindex="0">Shop single</a>
                          <a href="/contact-pages/contact-v1" class="dropdown-link w-dropdown-link" tabindex="0">Contact V1</a>
                          <a href="/contact-pages/contact-v2" class="dropdown-link w-dropdown-link" tabindex="0">Contact V2</a>
                          <a href="/contact-pages/contact-v3" class="dropdown-link w-dropdown-link" tabindex="0">Contact V3</a>
                          <a href="/request-a-quote" class="dropdown-link w-dropdown-link" tabindex="0">Request a quote</a>
                          <a href="/coming-soon" class="dropdown-link w-dropdown-link" tabindex="0">Coming soon</a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="text-200 bold dropdown-title">Utility pages</div>
                      <div class="w-layout-grid grid-1-column dropdown-link-column">
                        <a href="/template-pages/style-guide" class="dropdown-link w-dropdown-link" tabindex="0">Styleguide</a>
                        <a href="/template-pages/start-here" class="dropdown-link w-dropdown-link" tabindex="0">Start here</a>
                        <a href="https://construktiontemplate.webflow.io/404" class="dropdown-link w-dropdown-link" tabindex="0">404 not found</a>
                        <a href="https://construktiontemplate.webflow.io/401" class="dropdown-link w-dropdown-link" tabindex="0">Password protected</a>
                        <a href="/template-pages/licenses" class="dropdown-link w-dropdown-link" tabindex="0">Licenses</a>
                        <a href="/template-pages/changelog" class="dropdown-link w-dropdown-link" tabindex="0">Changelog</a>
                        <a href="https://brixtemplates.com/more-webflow-templates" target="_blank" class="dropdown-link medium w-dropdown-link" tabindex="0">More Webflow Templates</a>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </li>
          <li class="header-nav-list-item">
            <nuxt-link to="/blog" class="header-nav-link color-neutral-800 w-nav-link" style="max-width: 1316px;">Actualités</nuxt-link>
          </li>
          <li class="header-nav-list-item show-in-tablet">
            <nuxt-link to="/contact" class="btn-primary small w-button">Contact <span class="line-square-icon link-icon-right mg-left-6px"></span>
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>

</style>