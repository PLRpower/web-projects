import type { HttpContext } from '@adonisjs/core/http'
import { faqValidator } from '#validators/faq'
import Question from '#models/question'

export default class FaqController {
  async add({ request, response }: HttpContext) {
    const data = await request.validateUsing(faqValidator)

    await Question.create(data)

    return response.status(201)
  }

  async edit({ request, params, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(faqValidator)

    const question = await Question.findOrFail(id)
    question.merge(data)
    await question.save()

    return response.status(200)
  }

  async delete({ params, response }: HttpContext) {
    const { id } = params

    const question = await Question.findOrFail(id)
    await question.delete()

    return response.status(200)
  }
}
