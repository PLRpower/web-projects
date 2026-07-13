import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().maxLength(128),
    lastName: vine.string().maxLength(128),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    phone: vine.string().maxLength(20),
    birthDate: vine.date().before(DateTime.now().minus({ years: 18 }).toISODate()),
    billingName: vine.string().maxLength(255).nullable(),
    billingAddress: vine.string().maxLength(255),
    billingPostalCode: vine.string().maxLength(10),
    billingCity: vine.string().maxLength(128),
    billingCountry: vine.string().maxLength(128),
    vatNumber: vine.string().maxLength(50).nullable(),
    password: vine.string().minLength(6).maxLength(128),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(128)
  })
)
