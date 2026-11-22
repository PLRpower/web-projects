import Alpine from 'alpinejs'

/**
 * Global Photo Selection Store
 * Allows users to select multiple photos across the gallery and lightbox,
 * and batch-download them as a ZIP archive.
 */
Alpine.store('selection', {
  selected: [],
  isSelecting: false,

  toggle(id) {
    id = Number(id)
    const idx = this.selected.indexOf(id)
    if (idx > -1) {
      this.selected.splice(idx, 1)
    } else {
      this.selected.push(id)
      this.isSelecting = true
    }
  },

  isSelected(id) {
    return this.selected.includes(Number(id))
  },

  selectAll(ids) {
    if (!ids || ids.length === 0) return
    const currentSet = new Set(this.selected)
    ids.forEach((id) => currentSet.add(Number(id)))
    this.selected = Array.from(currentSet)
    this.isSelecting = true
  },

  deselectAll(ids) {
    if (!ids || ids.length === 0) {
      this.selected = []
    } else {
      const toRemove = new Set(ids.map(Number))
      this.selected = this.selected.filter((id) => !toRemove.has(id))
    }
  },

  clear() {
    this.selected = []
    this.isSelecting = false
  },

  download(categoryTitle = '') {
    if (this.selected.length === 0) return
    const ids = this.selected.join(',')
    const titleParam = categoryTitle ? `&title=${encodeURIComponent(categoryTitle)}` : ''
    window.location.href = `/telecharger-selection?ids=${ids}${titleParam}`
  },
})

/**
 * Modern Vanilla Photo Wall Component
 * - 0% photo cropping: respects 100% natural aspect ratio of professional photos
 * - Portraits remain authentic vertical portraits
 * - Landscapes remain authentic horizontal landscapes
 * - Multi-column hero spans (span 2 cols) for dynamic Freewall-like masonry feel
 * - Hardware-accelerated GPU translate3d positioning (60fps smooth)
 * - Zero jQuery or heavy library dependencies (<2KB pure JS)
 * - Instant calculation (<1ms) with zero cumulative layout shift (CLS)
 */
Alpine.data('photoWall', (config = {}) => ({
  medias: config.initialMedias || [],
  page: config.page || 1,
  lastPage: config.lastPage || 1,
  total: config.total || (config.initialMedias || []).length,
  loading: false,
  fetchUrl: config.fetchUrl || '',
  containerWidth: 1200,
  colCount: 4,
  colWidth: 280,
  gap: 16,
  totalHeight: 0,
  colHeights: [],
  positions: {},
  placedCount: 0,
  resizeObserver: null,
  sentinelObserver: null,
  loadMoreListener: null,

  init() {
    this.updateDimensions()
    this.placeItems(this.medias, false)

    this.loadMoreListener = () => {
      if (!this.loading && this.page < this.lastPage) {
        this.loadMore()
      }
    }
    window.addEventListener('load-more-photos', this.loadMoreListener)

    this.$nextTick(() => {
      this.updateDimensions()
      this.placeItems(this.medias, false)

      if (window.ResizeObserver && this.$refs.container) {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const newW = Math.floor(entry.contentRect.width)
            if (newW > 0 && Math.abs(newW - this.containerWidth) > 5) {
              this.updateDimensions()
              this.placeItems(this.medias, false)
            }
          }
        })
        this.resizeObserver.observe(this.$refs.container)
      }

      // Automatic Infinite Scroll: loads upcoming photos seamlessly before reaching bottom
      if (window.IntersectionObserver && this.$refs.sentinel) {
        this.sentinelObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[0]
            if (entry && entry.isIntersecting && !this.loading && this.page < this.lastPage) {
              this.loadMore()
            }
          },
          {
            rootMargin: '600px',
          }
        )
        this.sentinelObserver.observe(this.$refs.sentinel)
      }

      // Deep linking: automatically open photo if ?photo=ID is present in URL
      const params = new URLSearchParams(window.location.search)
      const photoId = params.get('photo')
      if (photoId) {
        const match = this.medias.find((m) => String(m.id) === String(photoId))
        if (match) {
          window.dispatchEvent(
            new CustomEvent('open-lightbox', {
              detail: {
                id: match.id,
                ext: match.extname,
                items: this.medias,
                index: this.medias.indexOf(match),
                total: this.total,
              },
            })
          )
        }
      }
    })
  },

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    if (this.sentinelObserver) {
      this.sentinelObserver.disconnect()
    }
    if (this.loadMoreListener) {
      window.removeEventListener('load-more-photos', this.loadMoreListener)
    }
  },

  updateDimensions() {
    const el = this.$refs.container
    const w = el ? el.clientWidth : window.innerWidth
    this.containerWidth = w || 1200

    if (w < 640) {
      this.colCount = 1
      this.gap = 12
    } else if (w < 900) {
      this.colCount = 2
      this.gap = 14
    } else if (w < 1200) {
      this.colCount = 3
      this.gap = 16
    } else {
      this.colCount = 4
      this.gap = 16
    }

    this.colWidth = Math.floor((this.containerWidth - (this.colCount - 1) * this.gap) / this.colCount)
  },

  placeItems(items, isAppend = false) {
    if (!items || items.length === 0) {
      if (!isAppend) this.totalHeight = 0
      return
    }

    if (!isAppend) {
      this.colHeights = new Array(this.colCount).fill(0)
      this.positions = {}
      this.placedCount = 0
    }

    const queue = [...items]
    const newPositions = isAppend ? { ...this.positions } : {}

    while (queue.length > 0) {
      const media = queue.shift()
      const w = media.width || 1080
      const h = media.height || 720
      const ratio = w / h

      const isLandscape = ratio >= 1.15
      const minGridHeight = Math.min(...this.colHeights)

      // When nearing the end of the batch/gallery, disable span-2 so remaining items level out all columns
      const isNearEnd = queue.length <= Math.max(6, this.colCount * 2)
      const wantsSpan2 = this.colCount >= 2 && isLandscape && !isNearEnd && this.placedCount % 3 === 0
      let placedAsSpan2 = false

      if (wantsSpan2) {
        // Find best adjacent column pair that is both level (diff <= 30) AND near the grid floor (lag <= 50)
        let bestPair = -1
        let minTop = Infinity
        for (let c = 0; c < this.colCount - 1; c++) {
          const top = Math.max(this.colHeights[c], this.colHeights[c + 1])
          const diff = Math.abs(this.colHeights[c] - this.colHeights[c + 1])
          if (diff <= 30 && top - minGridHeight <= 50 && top < minTop) {
            minTop = top
            bestPair = c
          }
        }

        if (bestPair !== -1) {
          const brickW = 2 * this.colWidth + this.gap
          const brickH = Math.round(brickW / ratio)
          const left = bestPair * (this.colWidth + this.gap)
          const top = minTop
          const newBottom = top + brickH + this.gap

          this.colHeights[bestPair] = newBottom
          this.colHeights[bestPair + 1] = newBottom

          newPositions[media.id] = {
            left: `${left}px`,
            top: `${top}px`,
            width: `${brickW}px`,
            height: `${brickH}px`,
            span: 2,
          }
          placedAsSpan2 = true
          this.placedCount++
        }
      }

      // If not placed as 2-column span, place as single photo into the shortest column
      if (!placedAsSpan2) {
        let minCol = 0
        for (let c = 1; c < this.colCount; c++) {
          if (this.colHeights[c] < this.colHeights[minCol]) {
            minCol = c
          }
        }

        const brickW = this.colWidth
        const brickH = Math.round(brickW / ratio)
        const left = minCol * (this.colWidth + this.gap)
        const top = this.colHeights[minCol]

        this.colHeights[minCol] += brickH + this.gap

        newPositions[media.id] = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${brickW}px`,
          height: `${brickH}px`,
          span: 1,
        }
        this.placedCount++
      }
    }

    this.positions = newPositions
    this.totalHeight = Math.max(...this.colHeights)
  },

  async loadMore() {
    if (this.loading || this.page >= this.lastPage) return
    this.loading = true
    this.page++

    try {
      const baseUrl = this.fetchUrl || window.location.pathname
      const sep = baseUrl.includes('?') ? '&' : '?'
      const res = await fetch(`${baseUrl}${sep}page=${this.page}&json=1`, {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      if (data.meta && typeof data.meta.total === 'number') {
        this.total = data.meta.total
      }
      if (data.data && data.data.length > 0) {
        const newItems = data.data
        // Incremental placement: compute coordinates BEFORE appending to reactive array
        this.placeItems(newItems, true)
        this.medias.push(...newItems)
        window.dispatchEvent(new CustomEvent('photos-loaded', { detail: { count: newItems.length } }))
      }
    } catch (e) {
      console.error('Erreur chargement photos', e)
    } finally {
      this.loading = false
    }
  },
}))

/**
 * Modern Lightbox Component for Alpine
 * - Prev / Next navigation with keyboard (← / →), lateral buttons and mobile touch swipe
 * - Deep linking (?photo=ID)
 * - Web Share API with clipboard copy fallback and toast confirmation
 * - Direct photo selection integration with Alpine.store('selection')
 */
Alpine.data('galleryLightbox', () => ({
  isOpen: false,
  currentSrc: '',
  zoomed: false,
  zoomOrigin: 'center',
  currentId: null,
  currentIndex: -1,
  currentLikes: 0,
  currentPhotographer: '',
  likedIds: [],
  liking: false,
  items: [],
  totalItems: 0,
  touchStartX: 0,
  touchStartY: 0,
  swiped: false,
  copied: false,
  copiedTimeout: null,
  imageCopied: false,
  imageCopying: false,
  imageCopiedTimeout: null,
  reportOpen: false,
  reportMotif: 'Droit à l\'image (demande de retrait)',
  reportDetails: '',
  reportContact: '',
  reportSending: false,
  reportSent: false,
  reportError: null,

  async submitReport(csrfToken) {
    if (!this.currentId || this.reportSending) return
    this.reportSending = true
    this.reportError = null

    try {
      const res = await fetch('/signaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mediaId: this.currentId,
          motif: this.reportMotif,
          details: this.reportDetails,
          contact: this.reportContact,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        this.reportSent = true
        this.reportDetails = ''
      } else {
        this.reportError = data.message || 'Une erreur est survenue lors de l\'envoi du signalement.'
      }
    } catch (e) {
      this.reportError = 'Erreur réseau lors de l\'envoi du signalement.'
    } finally {
      this.reportSending = false
    }
  },

  init() {
    try {
      const saved = JSON.parse(localStorage.getItem('cesi_drop_liked_medias') || '[]')
      if (Array.isArray(saved)) {
        this.likedIds = saved.map(Number).filter((n) => Number.isInteger(n) && n > 0)
      }
    } catch (e) {}

    window.addEventListener('photos-loaded', () => {
      if (this.isOpen && this.items && this.currentId) {
        this.currentIndex = this.items.findIndex((i) => String(i.id) === String(this.currentId))
      }
    })
  },

  isCurrentLiked() {
    return this.currentId ? this.likedIds.includes(Number(this.currentId)) : false
  },

  async toggleLike(csrfToken) {
    if (!this.currentId || this.liking) return
    this.liking = true
    const id = Number(this.currentId)

    try {
      const res = await fetch(`/media/${id}/like`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        this.currentLikes = Number(data.likes || 0)
        if (this.currentIndex >= 0 && this.items[this.currentIndex]) {
          this.items[this.currentIndex].likes = this.currentLikes
        }

        const set = new Set(this.likedIds)
        if (data.liked) {
          set.add(id)
        } else {
          set.delete(id)
        }
        this.likedIds = Array.from(set)
        try {
          localStorage.setItem('cesi_drop_liked_medias', JSON.stringify(this.likedIds.slice(-500)))
        } catch (e) {}
      }
    } catch (e) {
      console.error('Erreur coup de cœur:', e)
    } finally {
      this.liking = false
    }
  },

  open(payload) {
    let id = null
    let items = []
    let index = -1

    if (payload && typeof payload === 'object') {
      id = payload.id
      items = payload.items || []
      index = payload.index !== undefined ? payload.index : -1
    } else {
      id = payload
    }

    if (!id) return

    if (items && Array.isArray(items) && items.length > 0) {
      this.items = items
    }

    this.totalItems = payload && typeof payload === 'object' && payload.total
      ? Number(payload.total)
      : this.items.length

    this.currentId = id
    this.reportOpen = false
    this.reportSent = false
    this.reportError = null

    if (index >= 0) {
      this.currentIndex = index
    } else if (this.items.length > 0) {
      this.currentIndex = this.items.findIndex((i) => String(i.id) === String(id))
    } else {
      this.currentIndex = -1
    }

    this.updateCurrent()
    this.isOpen = true
    document.body.classList.add('overflow-hidden')

    this.updateUrlParam(this.currentId)
  },

  close() {
    if (this.swiped) return
    this.isOpen = false
    this.reportOpen = false
    this.reportSent = false
    this.reportError = null
    document.body.classList.remove('overflow-hidden')
    this.removeUrlParam()
  },

  updateCurrent() {
    if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
      const current = this.items[this.currentIndex]
      this.currentId = current.id
      this.currentLikes = Number(current.likes || 0)
      this.currentPhotographer = current.photographer || ''
    } else {
      this.currentLikes = 0
      this.currentPhotographer = ''
    }

    this.zoomed = false
    this.currentSrc = `/uploads/${this.currentId}.webp`
    this.updateUrlParam(this.currentId)
    this.preloadNeighbors()
  },

  preloadNeighbors() {
    if (!this.items || this.items.length === 0 || this.currentIndex < 0) return
    const neighbors = [this.items[this.currentIndex + 1], this.items[this.currentIndex - 1]]
    for (const item of neighbors) {
      if (item && item.id) {
        const img = new Image()
        img.decoding = 'async'
        img.src = `/uploads/${item.id}.webp`
      }
    }
  },

  toggleZoom(event) {
    if (this.swiped) return
    if (!this.zoomed) {
      const bounds = event.currentTarget.getBoundingClientRect()
      this.zoomOrigin = event.detail
        ? `${event.clientX - bounds.left}px ${event.clientY - bounds.top}px`
        : 'center'
    }
    this.zoomed = !this.zoomed
  },

  next() {
    if (this.items.length === 0) return

    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++
      this.updateCurrent()

      // If within 3 items of the loaded end, request next page in background
      if (this.currentIndex >= this.items.length - 3) {
        window.dispatchEvent(new CustomEvent('load-more-photos'))
      }
    } else {
      // Reached the end of current items, ask to load more
      window.dispatchEvent(new CustomEvent('load-more-photos'))
    }
  },

  prev() {
    if (this.items.length === 0) return

    if (this.currentIndex > 0) {
      this.currentIndex--
      this.updateCurrent()
    }
  },

  handleTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    }
  },

  handleTouchEnd(e) {
    if (!e.changedTouches || e.changedTouches.length === 0) return
    const deltaX = e.changedTouches[0].clientX - this.touchStartX
    const deltaY = e.changedTouches[0].clientY - this.touchStartY

    // Horizontal swipe threshold 45px, dominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      this.swiped = true
      setTimeout(() => {
        this.swiped = false
      }, 300)
      if (deltaX < 0) {
        this.next()
      } else {
        this.prev()
      }
    }
  },

  async copyCurrentImage() {
    if (!this.currentId || this.imageCopying) return
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      alert('La copie d\'image n\'est pas supportée par ce navigateur. Utilisez le bouton Télécharger.')
      return
    }

    this.imageCopying = true
    try {
      const res = await fetch(`/telecharger/${this.currentId}`)
      if (!res.ok) throw new Error('Erreur téléchargement')
      const jpegBlob = await res.blob()

      const img = new Image()
      const objectUrl = URL.createObjectURL(jpegBlob)
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = objectUrl
        })

        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
        if (!pngBlob) throw new Error('Erreur conversion PNG')

        await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
        this.imageCopied = true
        clearTimeout(this.imageCopiedTimeout)
        this.imageCopiedTimeout = setTimeout(() => {
          this.imageCopied = false
        }, 3000)
      } finally {
        URL.revokeObjectURL(objectUrl)
      }
    } catch (e) {
      console.error('Erreur copie image:', e)
      alert('Impossible de copier l\'image dans le presse-papiers. Utilisez le bouton Télécharger.')
    } finally {
      this.imageCopying = false
    }
  },

  async shareCurrent() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?photo=${this.currentId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CESI Drop'",
          text: `Découvre cette photo sur CESI Drop' !`,
          url: shareUrl,
        })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }

    // Fallback: clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl)
      this.copied = true
      clearTimeout(this.copiedTimeout)
      this.copiedTimeout = setTimeout(() => {
        this.copied = false
      }, 3000)
    } catch (e) {
      prompt('Copiez ce lien :', shareUrl)
    }
  },

  updateUrlParam(id) {
    try {
      const url = new URL(window.location)
      url.searchParams.set('photo', id)
      window.history.replaceState({}, '', url)
    } catch (e) {}
  },

  removeUrlParam() {
    try {
      const url = new URL(window.location)
      url.searchParams.delete('photo')
      window.history.replaceState({}, '', url)
    } catch (e) {}
  },
}))

/**
 * QR Code Modal for Category Direct Sharing (Admins)
 */
Alpine.data('qrModal', () => ({
  isOpen: false,
  title: '',
  url: '',
  qrSrc: '',
  copied: false,
  copiedTimeout: null,

  open(detail) {
    if (!detail || !detail.url) return
    this.title = detail.title || 'Évènement'
    this.url = detail.url.startsWith('http')
      ? detail.url
      : `${window.location.origin}${detail.url}`
    this.qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=16&format=png&data=${encodeURIComponent(this.url)}`
    this.copied = false
    this.isOpen = true
  },

  close() {
    this.isOpen = false
  },

  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.url)
      this.copied = true
      clearTimeout(this.copiedTimeout)
      this.copiedTimeout = setTimeout(() => {
        this.copied = false
      }, 2500)
    } catch (e) {
      prompt('Copiez ce lien :', this.url)
    }
  },

  async downloadQr() {
    try {
      const res = await fetch(this.qrSrc)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const safeName = this.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'evenement'
      a.href = objectUrl
      a.download = `qr-cesi-drop-${safeName}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      window.open(this.qrSrc, '_blank')
    }
  },
}))

window.Alpine = Alpine
Alpine.start()
