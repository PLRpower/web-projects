# Ballroom Strasbourg — White Ballroom

Editorial showcase website for the upcoming **White Ballroom** edition in Strasbourg, presented by Harmonie Nouvelle × Club Convives.
Static multi-language site available in **French** (`/`), **German** (`/de/`), **Dutch** (`/nl/`), and **English** (`/en/`).

## Tech Stack

- [Astro](https://astro.build) — static site, backend-free
- Pure CSS editorial design system (warm alabaster, obsidian ink, hairline grids, Cormorant Garamond & DM Sans)
- Build-time optimized images (responsive WebP via `astro:assets`)
- CSS `:target` archive lightbox enhanced with lightweight keyboard navigation

## Commands

```bash
npm install     # install dependencies
npm run dev     # development server -> http://localhost:4321
npm run build   # production build -> dist/
npm run preview # preview production build
```

## Structure

```
public/         # favicon.svg, og.jpg
src/
  assets/       # source photos (optimized at build time)
  i18n/         # dictionaries FR (source), DE, NL, EN
  components/   # editorial landing page sections
  layouts/      # Layout.astro (head, SEO, hreflang, typography)
  pages/        # index.astro (FR), de/index.astro, nl/index.astro, en/index.astro
  styles/       # global.css (White Ballroom editorial design system)
```
