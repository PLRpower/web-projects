// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Category from '#models/category'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class MediaController {
  async afficher({ view }: HttpContext) {
    const medias = await Media.findManyBy('accueil', true)
    const categories = await Category.all()
    return view.render('pages/accueil', { medias: medias, categories: categories })
  }

  async categorie({ view, params }: HttpContext) {
    const categorie = await Category.findOrFail(params.id)
    return view.render('pages/categorie', { categorie: categorie })
  }

  async publier({ request, response }: HttpContext) {
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
      extname: file.extname,
    })
    await media.save()

    const outputPath = app.makePath('uploads/', `${media.id}.webp`)
    await sharp(file.tmpPath)
      .webp()
      .rotate()
      .resize(1500, 1500, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(outputPath)

    await file.move(app.makePath('uploads/'), {
      name: `${media.id}_original.${file.extname}`,
    })
  }
}
