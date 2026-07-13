import type { HttpContext } from '@adonisjs/core/http'
import { testimonialValidator } from '#validators/testimonial'
import Testimonial from '#models/testimonial'
import sharp from 'sharp'

export default class TestimonialsController {
  async add({ request, response }: HttpContext) {
    const data = await request.validateUsing(testimonialValidator)

    const testimonial = new Testimonial()

    if(data.picture) {
      await sharp(data.picture.tmpPath)
        .rotate()
        .resize({ width: 200, height: 200, fit: sharp.fit.cover })
        .webp()
        .toFile(`storage/testimonials/${testimonial.id}.webp`)

      testimonial.picture = true
    } else {
      testimonial.picture = false
    }

    testimonial.title = data.title
    testimonial.description = data.description
    testimonial.name = data.name
    testimonial.company = data.company

    await testimonial.save()
    return response.status(201)
  }

  async edit({ request, params, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(testimonialValidator)

    const testimonial = await Testimonial.findOrFail(id)

    if(data.picture) {
      await sharp(data.picture.tmpPath)
        .rotate()
        .resize({ width: 200, height: 200, fit: sharp.fit.cover })
        .webp()
        .toFile(`storage/testimonials/${id}.webp`)

      testimonial.merge({ title: data.title, description: data.description, name: data.name, company: data.company, picture: true })
    } else {
      testimonial.merge({ title: data.title, description: data.description, name: data.name, company: data.company, picture: false })
    }

    await testimonial.save()
    return response.status(200)
  }

  async delete({ params, response }: HttpContext) {
    const { id } = params
    const testimonial = await Testimonial.findOrFail(id)
    await testimonial.delete()
    return response.status(200)
  }
}
