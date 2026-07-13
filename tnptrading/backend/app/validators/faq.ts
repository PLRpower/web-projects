import vine from '@vinejs/vine'

export const faqValidator = vine.compile(
  vine.object({
    question: vine.string(),
    answer: vine.string(),
  })
)
