# Ballroom Strasbourg — RED LIGHT SPECIAL 2026

Landing page « pressbook » de l'événement **RED LIGHT SPECIAL** (Ballroom Strasbourg, 24 octobre 2026).
Site vitrine d'une seule page, disponible en **français** (`/`), **allemand** (`/de/`) et **néerlandais** (`/nl/`).

## Stack

- [Astro](https://astro.build) — site statique, aucun backend, hébergeable partout (Netlify, Vercel, GitHub Pages…)
- Aucune dépendance JS côté client (CSS pur, polices Google Fonts) — la visionneuse
  de la galerie fonctionne uniquement avec `:target`
- Images optimisées à la build (WebP responsive via `astro:assets` / sharp)

## Commandes

```bash
npm install    # installer les dépendances
npm run dev    # serveur de développement → http://localhost:4321
npm run build  # build de production → dist/
npm run preview # prévisualiser le build
```

## Structure

```
public/         # favicon, og.jpg (image de partage)
src/
  assets/       # photos sources (optimisées à la build)
    gallery/    #   photos de scène — ballroom-01…27.jpg
    vinii/      #   portraits Vinii Revlon — vinii-01…04.jpg
  i18n/         # dictionnaires FR (source), DE, NL + TICKET_URL
  components/   # sections de la landing page
  layouts/      # Layout.astro (head, SEO, hreflang)
  pages/        # index.astro (FR), de/index.astro, nl/index.astro
  styles/       # global.css (design system « Red Light »)
```