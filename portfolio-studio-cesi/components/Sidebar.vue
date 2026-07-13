<script setup lang="ts">
import { ref } from 'vue'

interface SidebarItem {
  title: string
  href: string
  subItems?: SidebarItem[]
  isOpen?: boolean
}

const sidebarItems = ref<SidebarItem[]>([
  {
    title: 'Camera',
    href: '#camera',
    isOpen: false,
    subItems: [
      { title: 'Canon EOS R7', href: '#canon' },
    ],
  },
  {
    title: 'Objectif de caméra',
    href: '#objectif',
    isOpen: false,
    subItems: [
      { title: 'Sigma 70-200mm', href: '#sigma' },
    ],
  },
  {
    title: 'Stabilisateur',
    href: '#stabilisateur',
    isOpen: false,
    subItems: [
      { title: 'Osmo Mobile 6 Gris ardoise', href: '#osmo' },
    ],
  },
  {
    title: 'Action cam',
    href: '#action',
    isOpen: false,
    subItems: [
      { title: 'Bundle Osmo Action 4 Standard', href: '#bundle' },
      { title: 'FitStill Boîtier étanche', href: '#boitier' },
      { title: 'NEEWER 50', href: '#neewer' },
    ],
  },
  {
    title: 'Disque dur / Carte SD',
    href: '#disque',
    isOpen: false,
    subItems: [
      { title: 'Samsung SSD Externe', href: '#samsung' },
      { title: 'SanDisk 128 Go', href: '#sandisk' },
    ],
  },
  {
    title: 'Trépied',
    href: '#trepied',
    isOpen: false,
    subItems: [{ title: 'VICTIV 74”', href: '#victiv' }],
  },
])

const toggleSubItems = (item: SidebarItem) => {
  item.isOpen = !item.isOpen
}
</script>

<template>
  <div id="w-node-_53d28380-ec9d-4355-a8b3-10dbbfdecc90-bfdecc90" class="navigation-sidebar">
    <div class="sticky-top header-wrapper---main">
      <div data-animation="over-left" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" data-doc-height="1" role="banner" class="sidebar-wrapper w-nav">
        <div class="content-sidebar">
          <div class="sidebar-logo-section-container">
            <div class="logo-wrapper">
              <a href="/" class="header-logo w-inline-block">
                <img src="/img/logo.png" alt="Logo - Devdocs X Webflow Template" />
              </a>
            </div>
            <div class="hamburger-menu-wrapper header-btn w-nav-button">
              <div class="sidebar-collapse-icon-inner-container">
                <div class="hamburger-menu-bar top"></div>
                <div class="hamburger-menu-bar bottom"></div>
              </div>
            </div>
          </div>
          <div class="sidebar-nav-menu-wrapper">
            <div class="sidebar-nav-menu">
              <div>
                <div class="link-sidebar-wrapper first" style="margin-bottom: 12px"></div>
                <div class="link-sidebar-wrapper first" style="margin-bottom: 0; border-bottom: 0px">
                  <a href="/" class="link-sidebar" style="font-size: 18px">Portfolio V2</a>
                </div>
                <div style="margin-left: 10px">
                  <div v-for="item in sidebarItems" :key="item.title" class="link-sidebar-wrapper" style="border: none">
                    <a :href="item.href" class="link-sidebar" @click.prevent="toggleSubItems(item)">
                      {{ item.title }}
                      <nuxt-img src="/img/chevron.svg" class="chevron" style="width: 20px" :class="{ 'rotate': item.isOpen }">▼</nuxt-img>

                    </a>
                    <div v-if="item.subItems && item.isOpen" class="m-2">
                      <div v-for="subItem in item.subItems" :key="subItem.title" class="link-sidebar-wrapper" style="border: none">
                        <a :href="subItem.href" class="link-sidebar">{{ subItem.title }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-sidebar-wrapper {
  padding: 8px 0;
}

.m-2 {
  margin-left: 20px;
}

.rotate {
  transform: rotate(0deg)!important;
}

.chevron {
  transform: rotate(-90deg);
  transition: all .2s ease-in-out;
}
</style>
