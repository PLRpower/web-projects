import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    prenom: vine.string().maxLength(128),
    nom: vine.string().maxLength(128),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6).maxLength(128).confirmed(),
    campus: vine.string().maxLength(128),
    promotion: vine.string().maxLength(128),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(128),
  })
)
