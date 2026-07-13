import type { HttpContext } from '@adonisjs/core/http'
import Number from '#models/number'
import Question from '#models/question'
import Testimonial from '#models/testimonial'
import EmailFasionNight from '#models/email_fasion_night'
import DescriptionFashionNight from '#models/description_fashion_night'

export default class HomeController {
  async index({ response }: HttpContext) {
    let numbers = await Number.query().select('number', 'title', 'symbol').orderBy('id')

    let questions = await Question.query().select('question', 'answer').orderBy('id')

    let testimonials = await Testimonial.query().select('title', 'description', "name", "company", "picture").orderBy('id')

    return response.json({ numbers, questions, testimonials })
  }

  async emailFashionNight({ request, response }: HttpContext) {
    let email = request.input('email')

    await EmailFasionNight.create({ email })

    return response.status(201)
  }

  async descriptionFashionNight({ request, response }: HttpContext) {
    let nom = request.input('nom')
    let prenom = request.input('prenom')
    let description = request.input('description')

    await DescriptionFashionNight.create({ nom, prenom, description })

    return response.status(201)
  }
}
