// import type { HttpContext } from '@adonisjs/core/http'

import { newsletterValidator } from '#validators/newsletter'
import Newsletter from '#models/newsletter'
import { HttpContext } from '@adonisjs/core/http'

export default class NewslettersController {
  async create({ request }: HttpContext) {
    const data = await request.validateUsing(newsletterValidator)
    await Newsletter.create(data)
  }
}
