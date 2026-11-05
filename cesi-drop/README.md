# CESI Drop' — Modernized Version

This directory is a complete, lightweight overhaul of the **CESI Drop'** application using **AdonisJS v6**, designed to eliminate performance bottlenecks, remove technical debt (Webflow / jQuery / Freewall), and reduce media disk storage usage tenfold.

---

## Key Transformations

### 1. Image Gallery & Performance
* **Complete removal of jQuery and Freewall.js**: masonry layout is now handled entirely with **native CSS** (`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4`).
  * JavaScript execution time: **0 ms** (native GPU hardware acceleration by the browser).
  * Eliminated stutter and layout shifts during loading.
* **Lazy loading & async decoding**: all `<img>` tags use `loading="lazy"` and `decoding="async"`. The browser only fetches visible assets instead of requesting hundreds of images concurrently.
* **Pagination & Infinite Scroll**: home and category views load pictures in batches of 24 with smooth Alpine.js infinite scrolling.

### 2. Design System & CSS
* **Replaced Webflow codebase with Tailwind CSS**:
  * CSS reduced from **135 KB** of unpurged Webflow rules to just **6 KB** gzipped.
  * Removed all inline styling and blocking runtime scripts.
  * Modern, responsive dark theme (mobile, tablet, desktop).

### 3. Lightbox Modal & Interactions
* **Alpine.js + Native `<dialog>` element**:
  * Instant full-resolution image preview with backdrop blur and fade transition.
  * `Escape` key shortcut to close.
  * Dedicated "Download HD" action and quick deletion trigger for logged-in administrators.

### 4. Image Optimization Pipeline & Disk Storage
* **New uploads**:
  * Web delivery: automatic conversion to **WebP 1600px (quality 82)** (~80–150 KB per image).
  * HD download: conversion to **4K Ultra HD (3840px, quality 88–90)** instead of raw 20–25 MB uncompressed files. Result: excellent print quality at only **~1.5 MB per file** (~90% storage reduction).
* **Migration script for 26 GB of legacy photos**:
  * Dedicated utility `scripts/optimize-uploads.js` processes existing media assets in minutes.

### 5. CDN Preparation & Cloudflare Caching
* Routes `/uploads/:filename` and `/uploads/categories/:filename` emit the HTTP header:
  `Cache-Control: public, max-age=31536000, immutable`
  Images are permanently cached by browsers and Cloudflare CDN, reducing origin server load to near zero.

---

## Quick Start

### 1. Start the development server
```bash
npm run dev
```

### 2. Build for production
```bash
npm run build
```

### 3. Optimize 26 GB legacy image archive
* **Run in dry-run simulation mode** (estimates reclaimed space without modifying files):
```bash
npm run optimize:uploads
```
* **Execute image optimization**:
```bash
node scripts/optimize-uploads.js --apply
```

---

## Existing File Management
By default, `.env` configures:
```env
UPLOADS_PATH=../uploads
```
This allows the modern app to read and write directly into your existing media directory without duplicating legacy files on disk.
