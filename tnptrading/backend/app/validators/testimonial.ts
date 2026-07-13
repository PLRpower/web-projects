import vine from '@vinejs/vine'

export const testimonialValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string(),
    name: vine.string(),
    company: vine.string().nullable(),
    picture: vine.file({
      extnames: ['jpg', 'png', 'webp', 'jpeg']
    }).nullable()
  })
)
