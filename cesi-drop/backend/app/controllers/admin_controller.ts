// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Category from '#models/category'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'
import fs from 'node:fs'

export default class AdminController {
  async index({ view }: HttpContext) {
    return view.render('pages/admin')
  }

  async publier({ view }: HttpContext) {
    const categories = await Category.all()
    return view.render('pages/admin-publier', { categories: categories })
  }

  async publier_post({ request, response }: HttpContext) {
    const files = request.files('filepond')

    if (!files) {
      return response.badRequest('Aucun fichier reçu')
    }

    if (files.length > 1) {
      return response.badRequest('Un seul fichier est autorisé')
    }

    let file = files[0]
    file = Array.isArray(file) ? file[0] : file

    const media = await Media.create({
      published: true,
      categoryId: request.input('category'),
      extname: file.extname,
    })
    await media.save()

    const outputPath = app.makePath('uploads/', `${media.id}.webp`)
    await sharp(file.tmpPath)
      .webp()
      .rotate()
      .resize(1080, 1080, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(outputPath)

    await file.move(app.makePath('uploads/'), {
      name: `${media.id}_original.${file.extname}`,
    })
  }

  async moderer({ view }: HttpContext) {
    const medias = await Media.findManyBy('published', false)
    const categories = await Category.all()
    return view.render('pages/admin-moderer', { medias: medias, categories: categories })
  }

  async moderer_post({ request, response }: HttpContext) {
    const images = request.input('selected_images')
    const action = request.input('action')

    if (action === 'remove') {
      for (const image of images) {
        const media = await Media.findOrFail(image)
        const extname = media.extname
        await media.delete()
        const imagePath = app.makePath('uploads/', `${image}.webp`)
        const originalImagePath = app.makePath('uploads/', `${image}_original.${extname}`)

        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, () => {})
        }

        if (fs.existsSync(originalImagePath)) {
          fs.unlink(originalImagePath, () => {})
        }
      }
    } else if (action === 'add') {
      for (const image of images) {
        const media = await Media.findOrFail(image)
        media.published = true
        await media.save()
      }
    } else {
      for (const image of images) {
        const media = await Media.findOrFail(image)
        media.categoryId = action
        media.published = true
        await media.save()
      }
    }

    return response.redirect().toRoute('accueil')
  }

  async choisir({ view }: HttpContext) {
    const medias = await Media.findManyBy('published', true)
    return view.render('pages/admin-choisir', { medias: medias })
  }

  async choisir_post({ request, response }: HttpContext) {
    const images = request.input('selected_images')

    await Media.query().update({ accueil: false })
    if (!images) return response.redirect().toRoute('accueil')
    for (const image of images) {
      const media = await Media.findOrFail(image)
      media.accueil = true
      await media.save()
    }

    return response.redirect().toRoute('accueil')
  }

  async supprimer_post({ request, response }: HttpContext) {
    const image = request.input('imageId')
    const media = await Media.findOrFail(image)
    await media.delete()
    const imagePath = app.makePath('uploads/', `${image}.webp`)
    const originalImagePath = app.makePath('uploads/', `${image}_original.${media.extname}`)

    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, () => {})
    }

    if (fs.existsSync(originalImagePath)) {
      fs.unlink(originalImagePath, () => {})
    }

    return response.redirect().back()
  }
}
