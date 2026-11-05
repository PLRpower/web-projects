# Ballroom Strasbourg — RED LIGHT SPECIAL 2026

Pressbook landing page for the **RED LIGHT SPECIAL** event (Ballroom Strasbourg, October 24, 2026).
Single-page showcase website available in **French** (`/`), **German** (`/de/`), and **Dutch** (`/nl/`).

## Tech Stack

- [Astro](https://astro.build) — static site, backend-free, deployable anywhere (Netlify, Vercel, GitHub Pages…)
- Zero client-side JS dependencies (pure CSS, Google Fonts) — gallery lightbox operates entirely via CSS `:target`
- Build-time optimized images (responsive WebP via `astro:assets` / sharp)

## Commands

```bash
npm install     # install dependencies
npm run dev     # development server -> http://localhost:4321
npm run build   # production build -> dist/
npm run preview # preview production build
```

## Structure

```
public/         # favicon, og.jpg (social share image)
src/
  assets/       # source photos (optimized at build time)
    gallery/    #   stage photos — ballroom-01…27.jpg
    vinii/      #   Vinii Revlon portraits — vinii-01…04.jpg
  i18n/         # translation dictionaries FR (source), DE, NL + TICKET_URL
  components/   # landing page sections
  layouts/      # Layout.astro (head, SEO, hreflang)
  pages/        # index.astro (FR), de/index.astro, nl/index.astro
  styles/       # global.css ("Red Light" design system)
```
