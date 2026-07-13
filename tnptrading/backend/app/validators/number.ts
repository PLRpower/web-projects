import vine from '@vinejs/vine'

export const updateNumberValidator = vine.compile(
  vine.object({
    number: vine.number(),
    title: vine.string().maxLength(50),
    symbol: vine.string().maxLength(3).nullable(),
  })
)
