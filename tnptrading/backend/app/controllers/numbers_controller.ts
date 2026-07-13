import type { HttpContext } from '@adonisjs/core/http'
import Number from '#models/number'
import { updateNumberValidator } from '#validators/number'

export default class NumbersController {
  async edit({ request, params, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(updateNumberValidator)

    const number = await Number.findOrFail(id)
    number.merge(data)
    await number.save()

    return response.status(200)
  }
}
