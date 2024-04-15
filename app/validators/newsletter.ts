import vine from '@vinejs/vine'

export const newsletterValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().unique(async (db, value) => {
      const user = await db
        .from('users')
        .where('email', value)
        .first()
      return !user
    }),
  })
)
