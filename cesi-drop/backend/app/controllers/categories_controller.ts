// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import sharp from 'sharp'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class CategoriesController {
  async creer({ view }: HttpContext) {
    return view.render('pages/admin-categorie')
  }

  async creer_post({ response, request }: HttpContext) {
    const category = await Category.create({
      title: request.input('title'),
      description: request.input('description'),
    })
    await category.save()

    const outputPath = app.makePath('uploads/categories/', `${category.id}.webp`)
    const file = request.file('thumbnail')
    if (!file) {
      return response.badRequest('Aucun fichier reçu')
    }

    await sharp(file.tmpPath)
      .webp()
      .rotate()
      .resize({
        width: 500,
        height: 912,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toFile(outputPath)

    return response.redirect().toRoute('accueil')
  }

  async modifier({ view, params }: HttpContext) {
    const categorie = await Category.findOrFail(params.id)
    return view.render('pages/admin-modifier', { categorie: categorie })
  }

  async modifier_post({ request, params, response }: HttpContext) {
    const categorie = await Category.findOrFail(params.id)
    categorie.title = request.input('title')
    categorie.description = request.input('description')
    await categorie.save()

    const file = request.file('thumbnail')
    if (file) {
      const outputPath = app.makePath('uploads/categories/', `${categorie.id}.webp`)

      if (fs.existsSync(outputPath)) {
        fs.unlink(outputPath, () => {})
      }

      await sharp(file.tmpPath)
        .webp()
        .rotate()
        .resize({
          width: 500,
          height: 912,
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
        })
        .toFile(outputPath)
    }

    return response.redirect().toRoute('accueil')
  }

  async modifier_cat({ view }: HttpContext) {
    const categories = await Category.all()
    return view.render('pages/admin-modifier-cat', { categories: categories })
  }

  async supprimer_post({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    for (const media of await category.related('medias').query()) {
      const imagePath = app.makePath('uploads/', `${media.id}.webp`)
      const originalImagePath = app.makePath('uploads/', `${media.id}_original.${media.extname}`)
      await media.delete()

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, () => {})
      }

      if (fs.existsSync(originalImagePath)) {
        fs.unlink(originalImagePath, () => {})
      }
    }

    const outputPath = app.makePath('uploads/categories/', `${category.id}.webp`)
    await category.delete()

    if (fs.existsSync(outputPath)) {
      fs.unlink(outputPath, () => {})
    }

    return response.redirect().toRoute('accueil')
  }
}
